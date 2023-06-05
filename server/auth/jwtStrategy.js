// 인증 처리 라이브러리

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

// 환경변수를 사용할 수 있는 환경을 제공한다
require('dotenv').config();

const opts = {};
// 클라이언트는 토큰을 요청 헤더에 담아서 서버에 전송한다
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// 토큰 생성에 사용되는 키
opts.secretOrKey = process.env.SECRET;

// 토큰 처리전략 생성
const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    // 클라이언트로부터 전송받은 토큰으로 유저를 검색한다
    const user = await User.findOne({ username: jwt_payload.username });

    if (!user) { // 일치하는 유저가 없는 경우: 인증 실패
      return done(null, false);
    }

    // 인증 성공
    return done(null, user);

  } catch (err) {
    done(err, false);
  }
});

module.exports = jwtStrategy;