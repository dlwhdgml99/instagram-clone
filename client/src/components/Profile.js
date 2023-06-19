import { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import ArticleCreate from "./ArticleCreate";
import Timeline from "./Timeline";
import { getProfile, getTimeline, follow, unfollow } from "../utils/requests";
import Spinner from "./Spinner";

export default function Profile() {

  const { username } = useParams();
  const { user, setUser } = useContext(AuthContext);
  const isMaster = user.username === username;
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState(null);
  const [articleCount, setArticleCount] = useState(0);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  console.log(profile)

  useEffect(() => {
    setProfile(null);

    Promise.all([
      getProfile(username),
      getTimeline(username)
    ])
      .then(([profileData, timelineData]) => {
        setProfile(profileData.profile);

        setArticles(timelineData.articles);
        setArticleCount(timelineData.articleCount)
      })
      .catch(error => {
		// NotFound 페이지로 이동한다
        navigate("/notfound", { replace: true });
      })

  }, [username]);

  // 로그아웃 처리
  function handleSignOut() {
    const confirmed = window.confirm("로그아웃 하시겠습니까?");

    if (confirmed) {
      setUser(null);
    }
  }

  // 팔로우 처리
  async function handleFollow() {
    try {
      await follow(username)

      setProfile({ ...profile, isFollowing: true })

    } catch (error) {
      alert(error)
    }
  }

  // 언팔로우 처리
  async function handleUnfollow() {
    try {
      await unfollow(username)

      setProfile({ ...profile, isFollowing: false });

    } catch (error) {
      alert(error)
    }
  }

  // 타이틀 업데이트
  useEffect(() => {
    document.title = `${username} - Instagram`
  }, [])

  if (!profile) {
    return <Spinner />
  }

  return (
    <>
      <div className="px-4 mt-8">
        {/* Profile Image and Info */}
        <div className="flex mb-4">
          <img
            src={`${process.env.REACT_APP_SERVER}/files/profiles/${profile.avatar}`}
            className="w-20 h-20 object-cover border rounded-full"
          />

          <div className="grow ml-4">
            <div className="flex items-center mb-4">
              <h3>{profile.username}</h3>

              {isMaster && (
                <div className="flex ml-2">
                  <Link to="/accounts/edit" className="bg-gray-200 rounded-lg px-4 py-2 text-sm font-semibold">
                    정보수정
                  </Link>

                  <button
                    className="ml-2 bg-gray-200 px-4 py-2 text-sm font-semibold rounded-lg"
                    onClick={handleSignOut}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="w-4"
                    >
                      <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
                    </svg>
                  </button>
                </div>
              )}

              {(!isMaster && profile.isFollowing) && (
                <button
                  className="ml-2 bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
                  onClick={handleUnfollow}
                >
                  Following
                </button>
              )}

              {(!isMaster && !profile.isFollowing) && (
                <button
                  className="ml-2 bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2 rounded-lg"
                  onClick={handleFollow}
                >
                  Follow
                </button>
              )}
            </div>

			<ul className="flex items-center">
              <li className="w-1/3">
                <div className="text-sm">
                  <span className="font-semibold">
                    {profile.articleCount}
                  </span>
                  {" "}
                  게시물
                </div>
              </li>
              <li className="w-1/3">
                <Link to={`/profiles/${username}/followers`} className="block text-sm">
                  <span className="font-semibold">
                    {profile.followerCount}
                  </span>
                  {" "}
                  팔로워
                </Link>
              </li>
              <li className="w-1/3">
                <Link to={`/profiles/${username}/following`} className="block text-sm">
                  <span className="font-semibold">
                    {profile.followingCount}
                  </span>
                  {" "}
                  팔로잉
                </Link>
              </li>
            </ul>

			{/* 게시물 업로드 버튼 */}
			<svg
              className="w-6 fixed right-8 bottom-8 hover:scale-110 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              onClick={() => setActive(true)}
            >
              <path d="M200 344V280H136C122.7 280 112 269.3 112 256C112 242.7 122.7 232 136 232H200V168C200 154.7 210.7 144 224 144C237.3 144 248 154.7 248 168V232H312C325.3 232 336 242.7 336 256C336 269.3 325.3 280 312 280H248V344C248 357.3 237.3 368 224 368C210.7 368 200 357.3 200 344zM0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80H64C55.16 80 48 87.16 48 96z" />
            </svg>
		</div>
	</div>

	{/* 이름, 자기소개 */}
	{profile.fullName && (
          <h3 className="text-sm font-semibold my-2">{profile.fullName}</h3>
    )}
    {profile.bio && (
        <p className="text-sm my-2">
            {profile.bio}
        </p>
    )}
	</div>

			<hr className="mt-4 mb-4" />

			<Timeline
			articles={articles}
			articleCount={articleCount}
			/>

			<ArticleCreate
			active={active}
			setActive={setActive}
			/>
		</>
  	)
  }