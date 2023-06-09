const User = require('../models/User');
const Follow = require('../models/Follow');
const Article = require('../models/Article');
const Favorite = require('../models/Favorite');
// 파일 처리 라이브러리
const fileHandler = require('../utils/fileHandler');
const { json } = require('express');


// 피드 가져오기 로직
exports.feed = async (req, res, next) => {
	try {
		// Follow 컬렉션의 도큐먼트 중 팔로워가 로그인 유저인 도큐먼트 
		const follows = await Follow.find({ follower: req.user._id });
		// follows에서 following 값만 추출하여 리스트를 생성한다
		// 로그인 유저가 팔로우하는 유저들의 id 리스트
		const followings = follows.map(follow => follow.following);

		const where = { author: [...followings, req.user._id] } // 검색 조건
		const limit = req.query.limit || 5; // 한번 클라이언트에 전송할 때 보낼 도큐먼트의 수
		const skip = req.query.skip || 0; // 건너 뛸 도큐먼트의 수

		const articleCount = await Article.count(where); // 게시물 개수
		// 
		const articles = await Article
			.find(where)
			.populate({ // 컬렉션 조인
				path: 'author',
				select: 'username avatar' // 필드 선택
			})
			.populate({
				path: 'isFavorite'
			})
			.populate({
				path: 'commentCount'
			})
			.sort({ created: 'desc' })
			.skip(skip)
			.limit(limit)
		res.json({ articles, articleCount });	

	} catch (error) {
		next(error)
	}
};

// 게시물 가져오기 로직
exports.find = async (req, res, next) => {
	try {
		const where = {} // 검색 조건
		const limit = req.query.limit || 9 // 클라이언트에게 한번 전송할 때 보낼 도큐먼트의 수
		const skip = req.query.skip || 0 // 건너 뛸 도큐먼트의 수

		if ('username' in req.query) { // 프로필의 타임라인 게시물
			const user = await User.findOne({ username: req.query.username });
			where.author = user._id; // 검색 조건 추가
		}

		const articleCount = await Article.count(where); // 게시물의 개수
		const articles = await Article
			.find(where, 'photos favoriteCount created') // find(검색 조건, 검색 필드)
			.populate({
				path: 'commentCount' // 컬렉션 조인: 게시물에 달린 댓글 개수를 알 수 있다
			})
			.sort({ created: 'desc' }) // 생성일 기준 내림차순으로 정렬한다
			.limit(limit)
			.skip(skip)

		res.json({ articles, articleCount }); // 검색 결과를 전송한다

	} catch (error) {
		next (error)
	}
};

// 게시물 한개 가져오기
exports.findOne = async (req, res, next) => {
	try {
		const article = await Article 
			.findById(req.params.id) // id로 게시물을 검색한다
			.populate({
				path: 'author', // User 컬렉션과 조인
				select: 'username avatar' // 필드 선택
			})
			.populate({
				path: 'isFavorite' // Favorite 컬렉션과 조인
			})
			.populate({
				path: 'commentCount' // Comment 컬렉션과 조인 (댓글 개수)
			})
		
		if (!article) {
			const err = new Error("Article not found");
			err.status = 404; // NotFound (리소스 없음)
			throw err;
		}
		
		res.json({ article });

	} catch (error) {
		next (error)
	}
};

// 게시물 생성하기 로직
exports.create = [
	fileHandler("articles").array("photos"), // 파일 처리
	async (req, res, next) => {
		try {
			const files = req.files;

			if (files.length < 1) { // 파일이 없을 경우
				const err = new Error('File is required');
				err.status = 400;
				throw err;
			}

			const photos = files.map(file => file.filename); // 파일 이름으로 이루어진 배열을 생성한다

			const article = new Article({
				photos, // 파일 이름 리스트
				description: req.body.description,
				author: req.user._id // 로그인 유저
			});

			await article.save(); // 저장

			res.json({ article }); 

		} catch (error) {
			next(error)
		}
	}
];

// 게시물 삭제
exports.delete = async (req, res, next) => {
	try {
		// id parameter로 삭제할 게시물을 검색한다
		const article = await Article.findById(req.params.id);

		if (!article) { // 게시물이 존재하지 않을 경우
			const err = new Error("Article not found")
			err.status = 404; // 리소스 없음
			throw err;
		}

		// 본인 게시물이 아닌 경우
		if (req.user._id.toString() !== article.author.toString()) {
			const err = new Error("Author is not correct")
			err.status = 400;
			throw err;
		}

		await article.deleteOne();

		res.json({ article }); // 삭제한 게시물을 전송한다

	} catch (error) {
		next(error)
	}
};

// 좋아요
exports.favorite = async (req, res, next) => {
	try {
		// 좋아요 처리를 할 게시물을 검색한다
		const article = await Article.findById(req.params.id);

		if (!article) { // 게시물이 존재하지 않을 때
			const err = new Error("Article not found");
			err.status = 404; // NotFound
			throw err;
		}

		// 이미 좋아요 한 게시물인지 확인한다
		const _favorite = await Favorite // req.user: 로그인 유저 객체
			.findOne({ user: req.user._id, article: article._id })

		// 처음 좋아요 요청한 게시물이면
		if (!_favorite) {
			const favorite = new Favorite({
				user: req.user._id,
				article: article._id
			})
			await favorite.save(); // Favorite의 도큐먼트를 생성한다

			article.favoriteCount++; // 게시물의 좋아요 수를 1 증가시킨다
			await article.save(); // 변경사항을 저장한다
		}

		res.json({ article }) // 좋아요 처리를 완료한 게시물을 전송한다

	} catch (error) {
		next(error)
	}
};

// 좋아요 취소
exports.unfavorite = async (req, res, next) => {
	try {
		// 좋아요 취소할 게시물을 검색한다
		const article = await Article.findById(req.params.id);

		if (!article) { // 게시물이 존재하지 않을 때
			const err = new Error("Article not found");
			err.status = 404; // NotFound
			throw err;
		}

		// 이미 좋아요 한 게시물인지 확인한다
		const favorite = await Favorite // req.user: 로그인 유저 객체
			.findOne({ user: req.user._id, article: article._id })

		
		if (favorite) { // 좋아요 처리한 게시물이 맞으면

			await favorite.deleteOne(); // 도큐먼트를 삭제한다

			article.favoriteCount--; // 게시물의 좋아요 수를 1 감소시킨다
			await article.save(); // 변경사항을 저장한다
		}

		res.json({ article }) // 좋아요 취소가 완료된 게시물을 전송한다

	} catch (error) {
		next(error)
	}
};