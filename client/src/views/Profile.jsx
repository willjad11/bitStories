import styles from '../components/css/bitStories.module.css';
import { useHistory, useParams } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = (props) => {
    const [editedPostID, setEditedPostID] = useState("");
    const [profileError, setProfileError] = useState();
    const [userProfile, setUserProfile] = useState([]);
    const [newEditPost, setNewEditPost] = useState("");
    const [editErrors, setEditErrors] = useState({});
    const [postErrors, setPostErrors] = useState({});
    const [follower, setFollower] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [newPost, setNewPost] = useState("");
    const [posts, setPosts] = useState([]);
    const { user, setUser } = props;
    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        profileError && history.push('/feed');
    }, [profileError]);

    useEffect(() => {
        axios.defaults.withCredentials = true;
        !localStorage.getItem('userid') && 
            !user && 
                history.push('/');

        localStorage.getItem('userid') && 
            !user
                ? axios.get(`http://localhost:8000/api/users/${ localStorage.getItem('userid') }`)
                    .then(res => {
                        setUser(res.data)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                : setLoaded(true);

        axios.get(`http://localhost:8000/api/users/${ id }`)
            .then(res => {
                setUserProfile(res.data)
            })
            .catch(err => {
                setProfileError(err)
            })
    }, [user, id]);

    useEffect(() => {
        axios.defaults.withCredentials = true;
        const userID = user ? user.id : null;
        const profileID = id;
        const followObject = { userID, profileID };

        axios.get(`http://localhost:8000/api/profileposts/${ id }`)
            .then(res => {
                setPosts(res.data)
            })
            .catch(err => {
                console.log(err)
            });

        userID != null && 
                axios.post(`http://localhost:8000/api/follower`, followObject)
                .then(res => {
                    setFollower(res.data)
                })
                .catch(err => {
                    console.log({ err })
                });

        axios.get(`http://localhost:8000/api/followers/${ id }`)
            .then(res => {
                setFollowers(res.data)
            })
            .catch(err => {
                console.log(err)
            });
        
        document.getElementById(`post${ editedPostID }_content`) &&
            (document.getElementById(`post${ editedPostID }_content`).style.display = "")
        document.getElementById(`post${ editedPostID }_editContent`) &&
            (document.getElementById(`post${ editedPostID }_editContent`).style.display = "none")

    }, [refresh, user, id]);

    const addPost = async (e) => {
        e.preventDefault();

        if (user.id != id || localStorage.getItem('userid') != id) {
            e.preventDefault();
            return setPostErrors({ postContent: { message: "This object does not belong to you" } });
        }

        setPostErrors({});

        const postContent = newPost;
        const authorID = user.id;
        const postObject = { postContent, authorID }

        await axios.post(`http://localhost:8000/api/posts`, postObject, { withCredentials: true })
            .catch(err => {
                setPostErrors({ err }.err.response.data.errors)
            });

        setRefresh(!refresh);
        setNewPost("");
    }

    const changeAvatar = () => {
        const avatarURL = prompt('Enter URL for new avatar');
        const avatarReset = "";
        const sendAvatar = avatarURL ? { avatarURL } : { avatarReset };

        avatarURL &&
            axios.put(`http://localhost:8000/api/users/${ id }`, sendAvatar, { withCredentials: true })
                    .then(res => {
                        setUser(res.data)
                    })
                    .catch(err => {
                        console.log({ err })
                    });
    }

    const followHandler = async () => {
        const userID = user.id;
        const profileID = id;

        if (follower === null) {
            const followObject = { userID, profileID }
            await axios.post(`http://localhost:8000/api/followers`, followObject, { withCredentials: true })
                .then(res => {
                    setFollower(res.data)
                })
                .catch(err => {
                    console.log({ err })
                });
        }

        else {
            await axios.delete(`http://localhost:8000/api/follower/${ follower._id }`, { withCredentials: true })
                .then(res => {
                    setFollower(null)
                })
                .catch(err => {
                    console.log({ err })
                });
        }

        setRefresh(!refresh);
    }

    const updatePost = async (e) => {
        e.preventDefault();
        if (user.id != id || localStorage.getItem('userid') != id) {
            return setEditErrors({ postContent: { message: "This object does not belong to you" } });
        }

        setEditErrors({});

        const _id = e.target.getElementsByTagName("textarea")[0].id;
        const postContent = e.target.getElementsByTagName("textarea")[0].value;
        const updatePostObject = { postContent };

        await axios.put(`http://localhost:8000/api/post/${ _id }`, updatePostObject, { withCredentials: true })
        .catch(err => {
            setEditErrors({ err }.err.response.data.errors)
        });

        editPost(_id);
        setRefresh(!refresh);
    }

    const editPost = (postID) => {
        editedPostID && 
            postID != editedPostID && 
                document.getElementById(`post${ editedPostID }_editContent`).style.display == "" &&
                    editPost(editedPostID)
        setEditedPostID(postID);
        setNewEditPost(document.getElementById(`post${ postID }_content_post`).innerText)
        if (document.getElementById(`post${ postID }_content`).style.display == "") {
            document.getElementById(`post${ postID }_content`).style.display = "none";
            document.getElementById(`post${ postID }_editContent`).style.display = "";
        }

        else {
            document.getElementById(`post${ postID }_content`).style.display = "";
            document.getElementById(`post${ postID }_editContent`).style.display = "none";
        }
    }

    const deletePost = async (postID) => {
        if (user.id != id || localStorage.getItem('userid') != id) {
            return setPostErrors({ postContent: { message: "You cannot delete anything here" } });
        }

        if (window.confirm("Are you sure you want to delete this post?")) {
            await axios.delete(`http://localhost:8000/api/post/${ postID }`, { withCredentials: true })
                .catch(err => {
                    setEditErrors({ err }.err.response.data.errors)
                });

        setRefresh(!refresh);
        }
    }

    return (
        <div>
            <div className={ styles.navbar }>
                <h1>bitStories</h1>
                <div className={ styles.navRight }>
                    { loaded && 
                        <h3>Welcome, { user.firstName }</h3>
                    }
                    <div className={ styles.navRightButtons }>
                        <button 
                            className={ styles.logoutButton } 
                            onClick={ () => history.push('/feed') }>
                            bitFeed
                        </button>
                        { loaded && 
                            <LogoutButton setUser={ setUser } />
                        }
                    </div>
                </div>
            </div>
            <div className={ styles.profileCont }>
                <div className={ styles.profileContLeft }>
                    { loaded && 
                        <img 
                            className={ styles.profileAvatar } 
                            src={ userProfile.avatarURL ? 
                                userProfile.avatarURL : 
                                    require('../components/img/blank-avatar.png')
                            } 
                        />
                    }
                    { localStorage.getItem('userid') == userProfile.id && 
                        user.id == userProfile.id && 
                            <button 
                                className={ styles.profileChangeAvatar } 
                                onClick={ changeAvatar }>
                                Change Avatar
                            </button>
                    }
                    <h3>{ userProfile.firstName } { userProfile.lastName }</h3>
                    { user && 
                        user.id != userProfile.id && 
                            <button 
                                className={ styles.followButton } 
                                onClick={ followHandler }>
                                { follower == null ? 
                                    "Follow" : 
                                        "Unfollow"
                                }
                            </button>
                    }
                    { followers.length > 0 &&
                        <div className={ styles.followerListCont }>
                            <h3>Followers</h3>
                            <div className={ styles.followerInnerBox }>
                                { followers.map((follower, i) => 
                                    <div 
                                        className={ styles.followerInList }
                                        key={ i }
                                    >
                                        <img 
                                            className={ styles.followerListAvatar } 
                                            onClick={ () => {
                                                setFollowers([]);
                                                history.push(`/profile/${follower.id}`);
                                            } }
                                            src={ follower.avatarURL ? 
                                                    follower.avatarURL : 
                                                        require('../components/img/blank-avatar.png')
                                                } 
                                        />
                                        <p>{ follower.firstName } { follower.lastName }</p>
                                    </div>
                                )
                            }
                            </div>
                        </div>
                    }
                </div>
                <div className={ styles.profileContRight }>
                    { loaded && 
                        user.id == id && 
                            localStorage.getItem('userid') == id && 
                                <form 
                                    className={ styles.profileForm } 
                                    onSubmit={ addPost }
                                >
                                    { postErrors.postContent && 
                                        <div style={{ color: 'red' }}>
                                            { postErrors.postContent.message }
                                        </div>
                                    }
                                    <textarea 
                                        className={ styles.profileTextArea } 
                                        onChange={ (e) => setNewPost(e.target.value) } 
                                        value={ newPost }
                                        maxLength="200"
                                    />
                                    <input 
                                        type="submit" 
                                        className={ styles.profileSubmitPost } 
                                        value="Post" 
                                    />
                                </form>
                    }
                    { user && 
                        posts.length != 0 && 
                            posts.map((post, i) => 
                                <div 
                                    className={ styles.profilePost } 
                                    key={ i }
                                >
                                    <div className={ styles.profileName }>
                                        <p>
                                            { userProfile.firstName } { userProfile.lastName }
                                        </p>
                                        <i>
                                            <span className={styles.profilePostDate}>
                                                {post.createdAt.slice(0, 10)}
                                            </span>
                                        </i>
                                        { loaded && 
                                            user.id == id && 
                                                localStorage.getItem('userid') == id && 
                                                    <div className={ styles.managePost }>
                                                        <button 
                                                            className={ styles.managePostButton } 
                                                            onClick={ () => editPost(post._id) }>
                                                            Edit
                                                        </button>
                                                        <button 
                                                            className={ styles.managePostButton } 
                                                            onClick={ () => deletePost(post._id) }>
                                                            Delete
                                                        </button>
                                                    </div>
                                        }
                                    </div>
                                    <div 
                                        id={ `post${ post._id }_content` } 
                                        className={ styles.profilePostContent }
                                    >
                                        <p id={`post${post._id}_content_post`} >{ post.postContent }</p>
                                    </div>
                                    <div 
                                        id={ `post${ post._id }_editContent` } 
                                        className={ styles.profileEditPost } 
                                        style={ { display: 'none' } }
                                    >
                                        <form onSubmit={ updatePost }>
                                            { editErrors.postContent && 
                                                <div style={ { color: 'red' } }>{ editErrors.postContent.message }</div>
                                            }
                                            <textarea 
                                                id={ post._id } 
                                                className={ styles.profileEditPostTextArea } 
                                                value={ newEditPost }
                                                onChange={ (e) => setNewEditPost(e.target.value) }
                                                maxLength="200"
                                            />
                                            <div className={ styles.profileEditPostFormButtons }>
                                                <input 
                                                    type="submit" 
                                                    value="Submit Changes"
                                                />
                                                <button type="button" onClick={() => editPost(post._id)}>Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile;