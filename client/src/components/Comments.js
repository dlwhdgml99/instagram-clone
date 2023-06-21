import { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getComments, createComment, deleteComment } from "../utils/requests";
import Spinner from "./Spinner";

// 메인 컴포넌트
export default function Comments() {
	// 게시물의 아이디
	const { id } = useParams();
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	// 댓글 목록
	const [comments, setComments] = useState([]);
	// 댓글 개수
	const [commentCount, setCommentCount] = useState(0);

	// 서버에 댓글 가져오기 요청
	useEffect(() => {
		getComments(id)
		.then(data => {
			setComments([...comments, ...data.comments]);
			setCommentCount(data.commentCount);
		})
		.catch(error => {
			setError(error);
		})
		.finally(() => setIsLoaded(true));
	}, [])

	console.log(comments)
	console.log(commentCount)

	// 댓글 추가
	async function handleAddComment(content) {
		try {
			// 서버에 댓글 생성 요청
			const data = await createComment(id, content);

			// 댓글 개수를 1 증가시킨다
			setCommentCount(commentCount + 1);
			
			// comments 업데이트
			const updatedComments = [data.comment, ...comments];
			setComments(updatedComments);

		} catch (error) {
			alert(error)
		}
	}

	// 댓글 삭제
	async function handleDelete(id) {}

	// 댓글 리스트
	const commentList = comments.map(comment => (
		// 각각의 댓글
		<Comment 
			key={comment.id}
			comment={comment}
			handleDelete={handleDelete}
		/>
	))

	return (
		<div className="px-4">
			<h3 className="text-lg font-semibold my-4">댓글보기</h3>
			<Form 
				handleAddComment={handleAddComment}
			/>

			{commentCount > 0 ? (
				<ul>
					{commentList}
				</ul>
			) : (
				<p className="text-center">첫번째로 댓글을 달아보세요</p>
			)}

			{!isLoaded && <Spinner />}
			{error && <p className="text-red-500">{error.message}</p>}
		</div>
	)
}

// 폼
function Form({ handleAddComment }) {
	// 댓글 내용
	const [content, setContent] = useState("");

	// 폼 제출 처리
	async function handleSubmit(e) {
		try {
			e.preventDefault();

			await handleAddComment(content);

			setContent(""); // 댓글 입력칸을 비운다

		} catch (error) {
			alert(error)
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mb-4">
			<textarea 
			rows="2"
			className="border w-full px-2 py-1 rounded resize-none"
			value={content}
			onChange={({ target }) => setContent(target.value)}
			/>
			<button
				type="submit"
				className="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-[0.2]"
				disabled={!content.trim()}
			>
				댓글 달기
			</button>
		</form>
	)


}

// 댓글 아이템
function Comment() {}