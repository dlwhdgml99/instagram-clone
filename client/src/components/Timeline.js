import { Link } from 'react-router-dom';

export default function Timeline({ articles, articleCount }) {
	if (articleCount < 1) {
		return (
			<p className='text-center'>게시물이 없습니다</p>
		)
	}

	return (
		<ul className='grid grid-cols-3 gap-2 mb-2'>
			{articles.map(article => (
				<li key={article.id}>
					<Link to={`/p/${article.id}`} className='block h-40 relative'>
						{/* 썸네일 */}
						<img 
							src={`${process.env.REACT_APP_SERVER}/files/articles/${article.photos[0]}`}
							className="w-full h-full object-cover"	
						/>
						{/* 좋아요 댓글 수 (hover했을 때 나타난다) */}
						<div className='absolute inset-0 bg-black/[0.2] opacity-0 hover:opacity-100'>
							<div className='flex flex-col justify-center h-full'>
								<div className='flex justicy-center'>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 512 512"
										className="w-5 fill-white"
									>
										<path d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z" />
									</svg>
									<span className='ml-2 text-white'>{article.favoriteCount}</span>
								</div>

								<div className="flex justify-center">
									<svg
										className="w-5 fill-white"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 512 512"
									>
										<path d="M256 32C114.6 32 .0272 125.1 .0272 240c0 49.63 21.35 94.98 56.97 130.7c-12.5 50.37-54.27 95.27-54.77 95.77c-2.25 2.25-2.875 5.734-1.5 8.734C1.979 478.2 4.75 480 8 480c66.25 0 115.1-31.76 140.6-51.39C181.2 440.9 217.6 448 256 448c141.4 0 255.1-93.13 255.1-208S397.4 32 256 32z" />
									</svg>
									<span className='ml-2 text-white'>{article.favoriteCount}</span>
								</div>
							</div>
						</div>
					</Link>
				</li>
			))}
		</ul>
	)
}