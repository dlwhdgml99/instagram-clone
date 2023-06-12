// 서버 요청 라이브러리

const server = process.env.REACT_APP_SERVER;

/* USER */
export async function createUser(newUser) {
	const res = await fetch(`${server}/users`, {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(newUser)
	})

	if (!res.ok) { // 요청이 실패한 경우 에러를 던진다
		throw new Error(`${res.status} ${res.statusText}`);
	}

	// 요청이 성공한 경우 응답객체를 리턴한다
	return await res.json();
}

// 유저 정보 수정
export async function updateUser(formData) {
	const res = await fetch(`${server}/user`, {
		method: "PUT",
		// 로컬스토리지로부터 토큰을 가져와서 요청 헤더에 담는다
		headers: { "Authrization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).token },
		body: formData // 파일전송
	})

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
}

// 로그인
export async function signIn(email, password) {
	const res = await fetch(`${server}/user/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password })
	})

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
}

/* ARTICLES */

// 피드 가져오기
export async function getFeed(skip) {
	const res = await fetch(`${server}/feed?skip=${skip}`, { //skip 건너 뛸 도큐먼트의 수
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
	});

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
}

// 게시물 한개 개져오기
export async function getArticle(id) {
	const res = await fetch(`${server}/articles/${skip}`, {
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
	});

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
}

// 게시물 생성
export async function createArticle(formData) {
	const res = await fetch(`${server}/articles`, {
		method: "POST",
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token },
		body: formData
	})

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
}

// 게시물 삭제
export async function deleteArticle(id) {
	const res = await fetch(`${server}/articles/${id}`, {
		method: "DELETE",
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
	})

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
}

// 좋아요
export async function favorite(id) {
	const res = await fetch(`${server}/articles/${id}/favorite`, {
		method: "POST",
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
	})

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
}

// 좋아요 취소
export async function unfavorite(id) {
	const res = await fetch(`${server}/articles/${id}/favorite`, {
		method: "DELETE",
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
	})

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
}


/* COMMENTS */

// 댓글 가져오기
export async function getComments(id) {
	const res = await fetch(`${server}/articles/${id}`, {
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
	});

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
} 

// 댓글 생성
export async function createComments(id, content) {
	const res = await fetch(`${server}/articles/${id}/comments`, {
		method: "POST",
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token, 
		"Content-Type" : "application/json",
	 },
	 body: JSON.stringify({ content })
	})

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
} 

// 댓글 삭제
export async function deleteComment(id) {
	const res = await fetch(`${server}/comments/${id}`, {
		method: "DELETE",
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
	})

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
} 

/* PROFILES */

// 유저이름으로 프로필 가져오기
export async function getProfiles(username) {
	const res = await fetch(`${server}/profiles/?username=${username}`, {
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
	});

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
} 

// 프로필 상세보기
export async function getProfile(username) {
	const res = await fetch(`${server}/profiles/${username}`, {
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
	});

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
} 

// 타임라인 
export async function getTimeline(username) {
	const res = await fetch(`${server}/articles/?username=${username}`, {
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
	});

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
} 

// 팔로워 리스트
export async function getFollowers(username) {
	const res = await fetch(`${server}/profiles/?followers=${username}`, {
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
	});

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
} 

// 팔로잉 리스트
export async function getFollowings(username) {
	const res = await fetch(`${server}/profiles/?followings=${username}`, {
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
	});

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
} 

// 팔로우
export async function follow(username) {
	const res = await fetch(`${server}/profiles/${username}/follow`, {
		method: "POST",
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
	})

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
}

// 언팔로우
export async function unfollow(username) {
	const res = await fetch(`${server}/profiles/${username}/follow`, {
		method: "DELETE",
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
	})

	if (!res.ok) { 
		throw new Error(`${res.status} ${res.statusText}`);
	}
	
	return await res.json();
}
