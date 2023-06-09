const User = require('../models/User');
const Follow = require('../models/Follow');
const Article = require('../models/Article');
const { favorite } = require('./articleController');


// 프로필 리스트 가져오기
exports.find = async (req, res, next) => {
	try {
		const where = {};
		const limit = req.query.limit || 10;
		const skip = req.query.skip || 0;

		// 특정 유저가 팔로우하는 프로필 리스트
		if ('following' in req.query) {
			const user = await User.findOne({ username: req.query.following });
			const follows = await Follow
				.find({ follower: user._id })

			where._id = follows.map(follow => follow.following);
		}

		//특정 게시물을 좋아하는 프로필 리스트
		if('favorite' in req.query) {
			const favorites = await Favorite.find({ article: req.query.favorite })

			where._id = favorites.map(favorite => favorite.user);
		}

		
		if ('followers' in req.query) {
			const user = await User.findOne({ username: req.query.followers });
			const follows = await Follow
				.find({ following: user._id })
			
			where._id = follows.map(follow => follow.follower);
		}

		// 특정 글자를 유저이름에 포함한 프로필 리스트
		if ('username' in req.query) {
			// 정규식 사용
			where.username = new RegExp(req.query.username, 'i');
		}

		// 프로필 검색
		const profileCount = await User.count(where); // 프로필 개수

		const profiles = await User
			.find(where, 'username fullname avatar bio')
			.populate({
				path: 'isFollowing', // Follow 컬렉션과 조인
				match: { follower: req.user._id } // 로그인 유저가 팔로우 중인 프로필인지 확인
			})
			.limit(limit)
			.skip(skip)

		res.json({ profiles, profileCount });

	} catch (error) {
		next(error)
	}
};

// 프로필 한개 가져오기
exports.findOne = async (req, res, next) => {
	try {
		const _profile = await User
			.findOne({ username: req.params.username }, 'username fullName avatar bio')
			.populate({
				path: 'isFollowing', // Follow 컬렉션과 조인
				match: { follower: req.user._id } // 로그인 유저가 팔로우 중인 프로필인지 확인 가능
			})

		if (!_profile) { // 프로필이 존재하지 않을 경우
			const err = new Error("Profile not found");
			err.status = 404;
			throw err;
		}

		const {
			username,
			fullName,
			avatar,
			bio,
			isFollowing
		} = _profile;

		// 프로필 유저의 팔로잉 수
		const followingCount = await Follow.count({ follower: _profile._id })
		// 프로필 유저의 팔로워 수
		const followerCount = await Follow.count({ following: _profile._id })
		// 프로필 유저의 게시물 수
		const articleCount = await Article.count({ author: _profile._id })

		const profile = {
			username,
			fullName,
			avatar,
			bio,
			isFollowing,
			followingCount,
			followerCount,
			articleCount
		}

		res.json({ profile });

	} catch (error) {
		next(error)
	}
};

// 팔로우 처리
exports.follow = async (req, res, next) => {
	try {
		// 본인을 팔로우 요청한 경우
		if (req.user.username === req.params.username) {
			const err = new Error('Cannot Follow yourself')
			err.status = 400;
			throw err;
		}
		// 팔로우 할 프로필을 검색한다
		const profile = await User
			.findOne({ username: req.params.username }, 'username fullName avatar bio');
		
			if (!profile) { // 프로필이 존재하지 않을 경우
				const err = new Error('Profile not found')
				err.status = 404;
				throw err;
			}
		
		// 이미 팔로우 중인 프로필일 경우
		const _follow = await Follow
			.findOne({ follower: req.user._id, following: profile._id })
		
		if (!_follow) { // 새 팔로우인 경우
			const follow = new Follow({
				follower: req.user._id,
				following: profile._id
			})

			await follow.save();
		}

		res.json({ profile }); // 방금 팔로우한 프로필을 전송한다

	} catch (error) {
		next(error)
	}
};

// 팔로우 취소 처리
exports.unfollow = async (req, res, next) => {
	try {
		// 팔로우를 취소할 프로필을 검색한다
		const username = req.params.username;
		const profile = await User.findOne({ username }, 'username fullName avatar bio');

		if (!profile) { // 프로필이 존재하지 않는 경우
			const err = new Error('Profile not found')
			err.status = 404;
			throw err;
		}

		// 현재 팔로우 중인 프로필인지 확인한다
		const follow = await Follow
			.findOne({ follower: req.user._id, following: profile._id });
		
		if (follow) { // 팔로우중이면 팔로우를 취소한다
			await follow.deleteOne();
		}

		res.json({ profile }); // 팔로우를 취소한 프로필을 전송한다

	} catch (error) {
		next(error)
	}
};