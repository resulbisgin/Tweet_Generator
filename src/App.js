import { useState ,createRef,useEffect} from "react";
import {ReplyIcon,Retweet,Like, Share, Verified} from "./Icons"
import { AvatarLoader } from "./Loaders";
import { useScreenshot } from "use-react-screenshot";
import {language} from "./Language"
const tweetFormat=tweet=>{
  tweet=tweet.replace(/@([\wşçöğüıİ]+)/gi,'<span>@$1</span>')
  .replace(/#([\wşçöğüıİ]+)/gi,'<span>#$1</span>')
  .replace(/(https?:\/\/[\wşçöğüıİ\.\/]+)/,'<span>$1</span>')
  .replace(/\n/g, '<br />');
  return tweet
}

function convertImgToBase64(url,callback,outputFormat){
  const canvas=document.createElement('CANVAS');
  const ctx=canvas.getContext('2d')
  const img=new Image;
  img.crossOrigin='Anonymous';
  img.onload=function(){
    canvas.height=img.height;
    canvas.width=img.width;
    ctx.drawImage(img,0,0);
    const dataURL=canvas.toDataURL(outputFormat||'image/png');
    callback.call(this,dataURL);
    canvas=null;
  }
  img.src=url
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
  const [isVerified,setIsverified]=useState(0)
  const [tweet,setTweet]=useState();
  const [retweet,setRetweet]=useState(0);
  const [quoteTweets,setQuoteTweets]=useState(0);
  const [likes,setLikes]=useState(0);
  const [avatar,setAvatar]=useState();
  const [lang,setLang]=useState('tr')
  const [langtext,setLangtext]=useState()
  const [image, takeScreenshot] = useScreenshot()
  const getImage = () => takeScreenshot(twref.current)
  useEffect(()=>{
    setLangtext(language[lang])
  },[lang])

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

      convertImgToBase64(twitter.profile_image_url_https,function(base64Image){
        setAvatar(base64Image)
      })
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
        <h3>{langtext?.settings}</h3>
        <ul>
          <li>
            <input type="text" 
            className="input" 
            placeholder={langtext?.name}
             value={name} 
             onChange={(e)=>setName(e.target.value)}
             />
          </li>     
         <li>
            <input type="text"
             className="input"
             placeholder={langtext?.username}
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
            <label>Retweet</label>
            <input type="number"
             className="input"
             value={retweet} 
             onChange={(e)=>setRetweet(e.target.value)}
               />
          </li>
          <li>
          <label>{langtext?.quotation}</label>
            <input type="number"
             className="input"         
             value={quoteTweets} 
             onChange={(e)=>setQuoteTweets(e.target.value)}
               />
          </li>

          <li>
          <label>{langtext?.likes}</label>
            <input type="number"
             className="input"
          
             value={likes} 
             onChange={(e)=>setLikes(e.target.value)}
               />
          </li>
          <li>
            <label>{langtext?.verified}</label>
          <select onChange={(e)=>setIsverified(e.target.value)} defaultValue={isVerified}>
            <option value="1">{langtext?.check.yes}</option>
            <option value="0">{langtext?.check.no}</option>
          </select>
          </li>
          <button onClick={getImage}>{langtext?.create}</button>
          <div className="download-url">
            {image && <a href={image} ref={downloadRef} download="tweet.png">Tweeti İndir</a>}
          </div>
        </ul>
    </div>
  <div className="tweet-container">
    <div className="app-language">
      <span onClick={()=>setLang('tr')} className={lang ==='tr' && 'active'}>Türkçe</span>
      <span onClick={()=>setLang('en')} className={lang === 'en' && 'active'}>English</span>
    </div>
    <div className="fetch-info">
      <input type="text" value={username} placeholder={langtext?.user_know} onChange={(e)=>setUsername(e.target.value)}/>
      <button onClick={fetchTwitterInfo}>{langtext?.user_know1}</button>
    </div>
  <div className="tweet" ref={twref}>
   <div className='tweet-author'>
   {avatar &&  <img alt="profile"  src={avatar} /> || <AvatarLoader/>}
    <div>
      <div className="name">{name||langtext?.name}
      {isVerified==1 && <Verified width='19' height="19"/>}
      </div>
      <div className="username">@{username || langtext?.username}</div>
    </div>
   </div>
   <div className="tweet-content">
    <p dangerouslySetInnerHTML={{__html: tweet && tweetFormat(tweet) || langtext?.example}}></p>
   </div>
   <div className="tweet-stats">
    <span>
      <b>{formatNumber(retweet)}</b>Retweet
    </span>
    <span>
      <b>{formatNumber(quoteTweets)}</b>{langtext?.quotation}
    </span>
    <span>
      <b>{formatNumber(likes)}</b>{langtext?.likes}
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
