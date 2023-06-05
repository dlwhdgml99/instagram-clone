const User = require("../models/User"); // User 모델
const fileHandler = require('../utils/fileHandler'); // 파일 처리 패키지
// 유효성 검사 패키지
const { body, validationResult } = require('express-validator');

/*
	입력데이터 유효성검사에 필요한 변수들
*/

// 유효한 유저이름인지 확인
const isValidUsername = () => body('username')
.trim()
.isLength({ min: 5 }).withMessage('Username must be at least 5 characters')
.isAlphanumeric().withMessage("Username is only allowed in alphabet and number.")

// 유효한 이메일인지 확인
const isValidEmail = () => body('email')
	.trim()
	.isEmail().withMessage('E-mail is not valid')

// 유효한 비밀번호인지 확인
const isValidPassword = () => body('password')
	.trim()
	.isLength({ min: 5 }).withMessage('Password must be at least 5 characters')

// 이메일 중복검사
const emailInUse = () => async (email) => {
	const user = await User.findOne({ email }); // User 컬렉션을 검색한다

	if (user) {
		return Promise.reject('E-mail is already in use');
	}
}

// 유저이름 중복검사
const usernameInUse = () => async(username) => {
	const user = await User.findOne({ username });

	if (user) {
		return Promise.reject('Username is already in use');
	}
}

// 이메일의 존재 여부 (로그인 시 사용)
const doesEmailExists = () => async(email) => {
	const user = await User.findOne({ email });

	if (!user) {
		return Promise.reject('User is not found');
	}
}

// 이메일 중복검사
const doesPasswordMatch = () => async(password, { req }) => {
	const email = req.body.email;
	const user = await User.findOne({ email });

	if (!user.checkPassword(password)) {
		return Promise.reject('Password does not match');
	}
}

// 회원가입 로직
exports.create = [
	isValidUsername().custom(usernameInUse),
	isValidEmail().custom(emailInUse),
	isValidPassword(),
	async (req, res, next) => {
		// 가입절차
		try {
			const errors = validationResult(req); // 유효성 검사 결과

			if (!errors.isEmpty()) { // 유효성 검사 실패
				const err = new Error();
				err.errors = errors.array();
				err.status = 400; // 응답코드 400(Bad Request)
				throw err;
			}

			// 클라이언트가 전송한 데이터
			const { email, fullName, username, password } = req.body;

			// 새로운 유저를 생성한다
			const user = new User();

			user.email = email;
			user.fullName = fullName;
			user.username = username;
			user.setPassword(password);

			await user.save();

			res.json({ user }); // 클라이언트에게 생성한 객체를 전송한다

		} catch (error) {
			next(error) // 에러 핸들러에 전달한다 (app.js)
		}
	}
];

// 정보 수정 로직
exports.update = []

// 로그인 로직
exports.login = [];