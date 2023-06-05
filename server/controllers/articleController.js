const User = require('../models/User');
const Follow = require('../models/Follow');
const Article = require('../models/Article');
const Favorite = require('../models/Favorite');
// 파일 처리 라이브러리
const fileHandler = require('../utils/fileHandler');


// 피드 가져오기 로직
exports.feed = async (req, res, next) => {};

// 게시물 가져오기 로직
exports.find = async (req, res, next) => {};

// 게시물 한개 가져오기
exports.findOne = async (req, res, next) => {};

// 게시물 생성하기 로직
exports.create = [];

// 게시물 삭제
exports.delete = async (req, res, next) => {};

// 좋아요
exports.favorite = async (req, res, next) => {};

// 좋아요 취소
exports.unfavorite = async (req, res, next) => {};