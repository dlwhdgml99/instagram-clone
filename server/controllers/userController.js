const User = require('../models/User'); // User 모델
const fileHandler = require('../utils/fileHandler'); // 파일 처리 패키지
const { body, validationResult } = require('express-validator');

/* 입력데이터 유효성 검사에 필요한 변수들 */
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
const emailInUse = async (email) => {
  const user = await User.findOne({ email }); // User 컬렉션을 검색한다
  
  if (user) {
    return Promise.reject('E-mail is already in use');
  }
}

// 유저이름 중복검사
const usernameInUse = async (username) => {
  const user = await User.findOne({ username });

  if (user) {
    return Promise.reject('Username is already in use');
  }
}

// 이메일의 존재 여부 (로그인 시 사용)
const doesEmailExists = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return Promise.reject('User is not found');
  }
}

// 이메일 중복검사
const doesPasswordMatch = async (password, { req }) => {
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
    try {

      const errors = validationResult(req); // 유효성 검사결과

      if (!errors.isEmpty()) { // 유효성 검사 실패
        const err = new Error();
        err.errors = errors.array();
        err.status = 400; // 응답코드 400 (Bad request)
        throw err;
      }

      const { email, fullName, username, password } = req.body;

	  // 새로운 유저를 생성한다
      const user = new User();

      user.email = email;
      user.fullName = fullName;
      user.username = username;
      user.setPassword(password);

      await user.save();

      res.json({ user }); // 클라이언트에게 생성한 객체를 전달한다

    } catch (error) {
      next(error) // 에러 핸들러에 전달한다(app.js)
    }
  }
]

// 정보 수정 로직
exports.update = [
  fileHandler('profiles').single('avatar'), // 사진을 업로드 했을 때
  isValidUsername().custom(usernameInUse).optional(),
  isValidEmail().custom(emailInUse).optional(),
  async (req, res, next) => {
    try {
      const _user = req.user;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const err = new Error();
        err.errors = errors.array();
        err.status = 400;
        throw err;
      }

      if (req.file) { // 파일이 있는 경우 user의 avatar(프로필 사진)을 업데이트 한다
        _user.avatar = req.file.filename; // user 객체 중에서 클라이언트가 요청한 속성만 업데이트한다
      }

      Object.assign(_user, req.body);

      await _user.save(); // 변경사항을 저장한다

      const token = _user.generateJWT(); // 토큰 재 생성

      const user = {
        username: _user.username,
        email: _user.email,
        fullName: _user.fullName,
        avatar: _user.avatar,
        bio: _user.bio,
        token
      }

      res.json({ user })

    } catch (error) {
      next(error)
    }
  }
]

// 로그인 로직
exports.login = [
  isValidEmail().custom(doesEmailExists),
  isValidPassword().custom(doesPasswordMatch),
  async (req, res, next) => {
    try {

      const errors = validationResult(req);// 유효성 검사 결과

      if (!errors.isEmpty()) {
        const err = new Error();
        err.errors = errors.array();
        err.status = 401; // Unauthorized (인증 실패)
        throw err;
      }

      const { email } = req.body;

      const _user = await User.findOne({ email });

      const token = _user.generateJWT(); // 로그인 토큰을 생성한다
  
      const user = {
        username: _user.username,
        email: _user.email,
        fullName: _user.fullName,
        avatar: _user.avatar,
        bio: _user.bio,
        token
      }
  
      res.json({ user }) // 클라이언트에게 데이터 전송
  
    } catch (error) {
      next(error)
    }
  }
]