import { useEffect} from "react";
import { Link } from "react-router-dom";

export default function NotFound() {

	useEffect(() => {
		document.title = `Page not found - Instagram`;
	}, [])

	return (
		<div className="p-8">
			<h1 className="text-2xl font-semibold my-4 text-center">페이지를 찾을 수 없습니다</h1>
			<p className="block text-center">
				링크가 잘못되었거나 페이지가 삭제되었습니다 {" "}
				<Link to="/" className="text-blue-500">돌아가기</Link>
			</p>
		</div>
	)
}