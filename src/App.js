import { useState ,createRef,useEffect} from "react";
import {ReplyIcon,Retweet,Like, Share, Verified} from "./Icons"
import { AvatarLoader } from "./Loaders";
import { useScreenshot } from "use-react-screenshot";
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
  const twref = createRef(null)
  const downloadRef=createRef();
  const [name,setName]=useState();
  const [username,setUsername]=useState();
  const [isVerified,setIsverified]=useState(false)
  const [tweet,setTweet]=useState();
  const [retweet,setRetweet]=useState(0);
  const [quoteTweets,setQuoteTweets]=useState(0);
  const [likes,setLikes]=useState(0);
  const [avatar,setAvatar]=useState();
  const [image, takeScreenshot] = useScreenshot()
  const getImage = () => takeScreenshot(twref.current)

    useEffect(()=>{
      if(image){
      downloadRef.current.click();
      }
    },[image])

  const avatarHandle=e=>{
  const file= e.target.files[0];
  const reader=new FileReader();
  reader.addEventListener("load",function(){
    setAvatar(this.result)
  })
  reader.readAsDataURL(file)
  }
  const fetchTwitterInfo=()=>{
    fetch(`https://typeahead-js-twitter-api-proxy.herokuapp.com/demo/search?q=${username}`)
    .then(res=>res.json())
    .then(data=>{
      const twitter=data[0]
      setAvatar(twitter.profile_image_url_https)
      setName(twitter.name)
      setUsername(twitter.screen_name)
      setTweet(twitter.status.text)
      setRetweet(twitter.status.retweet_count)
      setLikes(twitter.status.favorite_count)
    })
  }
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
            <input placeholder="Avatar" 
            type="file"
            className="input"
            onChange={avatarHandle}
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
          <button onClick={getImage}>Oluştur</button>
          <div className="download-url">
            {image && <a href={image} ref={downloadRef} download="tweet.png">Tweeti İndir</a>}
          </div>
        </ul>
    </div>
  <div className="tweet-container">
    <div className="fetch-info">
      <input type="text" value={username} placeholder="Kullanıcı Bilgilerini Çek" onChange={(e)=>setUsername(e.target.value)}/>
      <button onClick={fetchTwitterInfo}>Bilgileri Çek</button>
    </div>
  <div className="tweet" ref={twref}>
   <div className='tweet-author'>
   {avatar &&  <img alt="profile"  src={avatar} /> || <AvatarLoader/>}
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
