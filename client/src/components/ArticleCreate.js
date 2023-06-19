import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createArticle } from "../utils/requests";

//active : 모달창 표시
export default function ArticleCreate({ active, setActive }) {
	const navigate = useNavigate();
	// 사진에 대한 설명
	const [description, setDescription] = useState("");
	// 이미지 파일
	const [files, setFiles] = useState([]);

	// 폼 제출 처리
	async function handleSubmit(e) {
		try {
			e.preventDefault();

			const formData = new FormData();

			// 폼 데이터에 전송할 데이터를 추가한다
			files.forEach(file => {
				formData.append('photos', file);
			})

			formData.append('description', description);

			// 서버에 폼데이터를 전송한다
			await createArticle(formData);

			// 업로드가 완료되면 피드로 이동한다
			navigate("/");

		} catch (error) {
			alert(error)
		}
	}

	// 모달창 닫기
	function close(e) {
		// e.currentTarget : 클릭한 오버레이
		if (e.target === e.currentTarget) {
			setActive(false);
		}
	}

	if (active) {
		return (
			<div className="fixed inset-0 bg-black/[0.2] z-10" onClick={close}>
				{/* 모달 닫기 버튼 */}
				<button
					type="button"
					className="float-right text-2xl px-4 py-2 text-white"
					onClick={() => setActive(false)}
				>
					&times;
				</button>

				{/* 폼 */}
				<form className="bg-white max-w-xs mt-20 mx-auto rounded-2xl" onSubmit={handleSubmit}>
					<div className="p-4 border-b">
						<h3 className="text-lg font-semibold text-center">게시물 업로드</h3>
					</div>

					<div className="p-4">
						{/* upload Button */}
						<label className="inline-block mb-2 font-semibold text-sm px-4 py-2 bg-gray-200 rounded-lg cursor-pointer">
							<input 
								type="file"
								className="hidden"
								// Array.from(): 순화가능한 데이터 타입을 자바스크립트의 배열 타입으로 변환한다
								onChange={({ target }) => setFiles(Array.from(target.files))}
								multiple={true}
								accept="image/png, image/jpg, image/jpeg"
							/>
							사진 선택
						</label>

						{/* 선택된 파일로 썸네일을 생성한다 */}
						{files.length > 0 && (
							<ul className="grid grid-cols-3 mb-2">
								{files.map(file => (
									<li key={file.name} className="pt-[100%] relative">
										<img 
											className="absolute inset-0 w-full h-full object-cover"
											src={URL.createObjectURL(file)}
											alt={file.name}
										/>
									</li>	
								))}
							</ul>
						)}

						{/* 사진에 대한 설명 작성란 */}
						<div className="mb-2">
							<label
								htmlFor="description"
								className="block font-semibold"
							>
								사진에 대한 설명을 공유해주세요
							</label>
							<textarea 
								rows="2"
								id="description"
								className="block w-full px-2 py-1 rounded border"
								onChange={({ target }) => setDescription(target.value)}
								value={description}
							/>
						</div>

						<button 
							type="submit"
							className="px-4 py-2 text-sm font-semibold bg-blue-500 rounded-lg text-white disabled:opacity-[0.2]"
							disabled={files.length < 1}	
						>
							업로드
						</button>
					</div>
				</form>
			</div>
		)
	}
}