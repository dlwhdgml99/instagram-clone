const server = process.env.REACT_APP_SERVER;

/* USER  */
export async function createUser(newUser) {
  const res = await fetch(`${server}/users`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(newUser)
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function updateUser(formData) {
  const res = await fetch(`${server}/user`, {
    method: "PUT",
    headers: { "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).token },
    body: formData
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

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
export async function getFeed(skip) {
  const res = await fetch(`${server}/feed?skip=${skip}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getArticle(id) {
  const res = await fetch(`${server}/articles/${id}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function createArticle(formData) {
  const res = await fetch(`${server}/articles`, {
    method: "POST",
    headers: { "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).token },
    body: formData
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function deleteArticle(id) {
  const res = await fetch(`${server}/articles/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function favorite(id) {
  const res = await fetch(`${server}/articles/${id}/favorite`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function unfavorite(id) {
  const res = await fetch(`${server}/articles/${id}/favorite`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

/* COMMENTS */
export async function getComments(id) {
  const res = await fetch(`${server}/articles/${id}/comments`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function createComment(id, content) {

  const res = await fetch(`${server}/articles/${id}/comments`, {
    method: "POST",
    headers: {
      "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content })
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}


export async function deleteComment(id) {
  const res = await fetch(`${server}/comments/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

/* PROFILES */
export async function getProfiles(username) {
  const res = await fetch(`${server}/profiles/?username=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getProfile(username) {
  const res = await fetch(`${server}/profiles/${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getTimeline(username) {
  const res = await fetch(`${server}/articles/?username=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getFollowers(username) {
  const res = await fetch(`${server}/profiles/?followers=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getFollowings(username) {
  const res = await fetch(`${server}/profiles/?following=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function follow(username) {
  const res = await fetch(`${server}/profiles/${username}/follow`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function unfollow(username) {
  const res = await fetch(`${server}/profiles/${username}/follow`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}