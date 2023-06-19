import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from "./AuthContext";
import Carousel from "./Carousel";

export default function ArticleTemplate({
	article,
	handleDelete,
	handleFavorite,
	handleUnfavorite
}) {
	// 모달 관리
	const [active, setActive] = useState(false);
	// 로그인 유저 객체
	const { user } = useContext(AuthContext);
	// 본인 게시물인 경우 true
	const isMaster = user.username === article.author.username;

	// 모달 닫기
	function close(e) {
		if(e.target === e.currentTarget) {
			setActive(false);
		}
	}

	// 모달
	const modal = (
		<div
			className="fixed inset-0 flex justify-center bg-black/[0.2] z-10"
			onClick={close}
		>
			<ul className="bg-white w-60 rounded-lg">
				<li className="border-b">
					<button className="w-full px-4 py-2 text-sm font-semibold text-red-500"
					onClick={() => handleDelete(article.id)}>
						삭제
					</button>
				</li>
				<li>
					<button
						className="w-full px-4 py-2 text-sm font-semibold"
						onClick={() => setActive(false)}>
							닫기
						</button>
				</li>
			</ul>
		</div>
	)
}