import styles from '../components/css/bitStories.module.css';
import LogoutButton from '../components/LogoutButton';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Feed = (props) => {
    const [followedUsers, setFollowedUsers] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [posts, setPosts] = useState([]);
    const {user, setUser} = props;
    const history = useHistory();

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

        user && 
            axios.get(`http://localhost:8000/api/posts/${ user.id }`)
                .then(res => {
                    setPosts(res.data)
                })
                .catch(err => {
                    console.log(err)
                });
    }, [user]);

    useEffect(() => {
        axios.defaults.withCredentials = true;
        user && 
            posts && 
                axios.get(`http://localhost:8000/api/followedusers/${ user.id }`)
                .then(res => {
                    setFollowedUsers(res.data)
                })
                .catch(err => {
                    console.log(err)
                });
    }, [user]);

    return (
        <div>
            <div className={ styles.navbar }>
                <h1>bitStories</h1>
                <div className={ styles.navRight }>
                    { loaded && 
                        <h3>Welcome, { user.firstName }</h3>
                    }
                    { loaded && 
                        <div className={ styles.navRightButtons }>
                            <button 
                                className={ styles.logoutButton } 
                                onClick={ () => history.push(`/profile/${ user.id }`) }>
                                My Profile
                            </button>
                            <LogoutButton setUser={ setUser } />
                        </div>
                    }
                </div>
            </div>
            <div className={ styles.feedCont }>
                { loaded && 
                    <img 
                        onClick={ () => history.push(`/profile/${ user.id }`) }
                        className={ styles.avatar } 
                        src={ user.avatarURL ? 
                                user.avatarURL : 
                                    require('../components/img/blank-avatar.png') }
                    />
                }
                <h1>bitFeed</h1>
                { loaded && 
                    posts.length == 0 ? 
                        <i>No posts to show</i> : 
                            posts.map((post, i) => 
                                <div 
                                    className={ styles.feedPost } 
                                    key={ i }
                                >
                                    <div>
                                        { followedUsers && 
                                            <img 
                                                className={ styles.feedAvatar } 
                                                onClick={ () => history.push(`/profile/${ post.authorID }`) } 
                                                src={
                                                    followedUsers[`${ post.authorID }`].avatarURL ? 
                                                        followedUsers[`${ post.authorID }`].avatarURL : 
                                                            require('../components/img/blank-avatar.png')
                                                }
                                            />
                                        }
                                    </div>
                                    <div className={ styles.feedProfileName }>
                                        { followedUsers && 
                                            <p>{ followedUsers[`${ post.authorID }`].firstName } { followedUsers[`${ post.authorID }`].lastName }</p> }
                                        <i>
                                            <span className={ styles.feedPostDate }>
                                                { post.createdAt.slice(0, 10) }
                                            </span>
                                        </i>
                                    </div>
                                    <div className={ styles.feedPostContent }>
                                        <p>{ post.postContent }</p>
                                    </div>
                                </div>
                        )
                    }
            </div>
        </div>
    )
}

export default Feed;