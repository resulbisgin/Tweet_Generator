import { useState } from "react";
import {ReplyIcon,Retweet,Like, Share, Verified} from "./Icons"
import { AvatarLoader } from "./Loaders";
const tweetFormat=tweet=>{
  tweet=tweet.replace(/@([\wşçöğüıİ]+)/gi,'<span>@$1</span>')
  .replace(/#([\wşçöğüıİ]+)/gi,'<span>#$1</span>')
  .replace(/(https?:\/\/[\wşçöğüıİ\.\/]+)/,'<span>$1</span>')
  return tweet
}
function App() {
  const formatNumber = number => {
    if (!number) {
      number = 0;
    }
    if (number < 10000 ) {
      return number;
    }
   
   
    number /= 1000;
    number = String(number).split('.');
  
    return (
      number[0] + (number[1] > 100 ? ',' + number[1].slice(0, 1) + ' B' : ' B')
    );
  };
  const [name,setName]=useState();
  const [username,setUsername]=useState();
  const [isVerified,setIsverified]=useState(false)
  const [tweet,setTweet]=useState();
  const [avatar,setAvatar]=useState();
  const [retweet,setRetweet]=useState(0);
  const [quoteTweets,setQuoteTweets]=useState(0);
  const [likes,setLikes]=useState(0);


  return (
  <>
      <div className="tweet-settings">
        <h3>Tweet Ayarları</h3>
        <ul>
          <li>
            <input type="text" 
            className="input" 
            placeholder="Ad Soyad"
             value={name} 
             onChange={(e)=>setName(e.target.value)}
             />
          </li>     
         <li>
            <input type="text"
             className="input"
             placeholder="Kullanıcı Adı"
             value={username} 
             onChange={(e)=>setUsername(e.target.value)}
               />
          </li>
          <li>
            <textarea placeholder="Tweet" 
            value={tweet}
            onChange={(e)=>setTweet(e.target.value)}
            maxLength="290"
            /> 
          </li>
          <li>
            <input type="number"
             className="input"
             placeholder="Retweet"
             value={retweet} 
             onChange={(e)=>setRetweet(e.target.value)}
               />
          </li>
          <li>
            <input type="number"
             className="input"
             placeholder="Alıntılı Tweetler"
             value={quoteTweets} 
             onChange={(e)=>setQuoteTweets(e.target.value)}
               />
          </li>
          <li>
            <input type="number"
             className="input"
             placeholder="Beğeni"
             value={likes} 
             onChange={(e)=>setLikes(e.target.value)}
               />
          </li>
          <button>Oluştur</button>
        </ul>
    </div>
  <div className="tweet-container">

  <div className="tweet">
   <div className='tweet-author'>
    <img alt="profile"  src={avatar}/>
    <div>
      <div className="name">{name||"Ad Soyad"}
      {isVerified && <Verified width='19' height="19"/>}
      </div>
      <div className="username">@{username || "Kullanıcı Adı:"}</div>
    </div>
   </div>
   <div className="tweet-content">
    <p dangerouslySetInnerHTML={{__html: tweet && tweetFormat(tweet) || "Örnek Tweet"}}></p>
   </div>
   <div className="tweet-stats">
    <span>
      <b>{formatNumber(retweet)}</b>Retweet
    </span>
    <span>
      <b>{formatNumber(quoteTweets)}</b>Alıntılı Tweetler
    </span>
    <span>
      <b>{formatNumber(likes)}</b>Beğeni
    </span>
   </div>
   <div className="tweet-actions">
    <span><ReplyIcon /></span>
    <span><Retweet/></span>
    <span><Like/></span>
    <span><Share/></span>
   </div>
    </div>
  </div>
  </>
  );
}

export default App;
