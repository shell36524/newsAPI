//NEWS API 호출함수
//new URL() 객체 생성
//async 사용
let news = []; //article만 보여주기
let menus = document.querySelectorAll(".menus button"); //메뉴 버튼 가져오기(이벤트설정 위함)

menus.forEach(menu=> menu.addEventListener("click",(event)=> getNewsByTopic(event)));

//키워드 검색버튼
let searchButton = document.getElementById("search-button");
let url;

/**
 * 코드 리펙토링
 * 각 함수에서 필요한 url 만들기
 * api 호출함수를 부른다
 */

//내용~화면출력
const getNews = async ()=>{
  //new Headers() : api key 넣기
  let header = new Headers({"x-api-key":"iTv6o8c51joER-y0qxhwVuf-7ARg_lUqHvxLOsD0nW0"})
  
  //서버에 요청한 데이터를 가져오기 전까지 실행 x => async / await 사용
  //await 사용
  let response = await fetch(url,{headers:header});  //ajax, http, fetch 등 사용
  //json type
  let data = await response.json();
  news = data.articles;
  console.log(news);

  render();
}

const getLatesNews = async ()=>{
  url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=news&page_size=10`
  );

  getNews();
};

//버튼 클릭 이벤트(await 사용하기위해 async)
const getNewsByTopic = async(event) =>{
  
  //소문자로 변경
  let topic = event.target.textContent.toLowerCase()
  url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);
  
  getNews();
};

//키워드 검색시 보여주는 이벤트
const getNewsByKeyword = async()=>{
  //1.검색 키워드 읽어오기
  let keyword = document.getElementById("search-input").value;

  //2.url에 검색 키워드 붙이기 : search NEWS 이용
  url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);
  //3.헤더준비
  //4.url 불러오기
  //5.데이터 가져오기
  //6.데이터 보여주기
  
  getNews();
}

//배열 news를 원하는 항목만을 가져와 html로 재배열
//array function 사용
const render = ()=>{
  let newsHTML = "";
  newsHTML = news
    .map((item)=>{
    return `<div class="row news">
    <div class="col-lg-4">
    <img src="${item.media}" class="news-img-size">
    </div>
    <div class="col-lg-8">
    <h2>${item.title}</h2>
    <p>
    ${item.summary}
    </p>
    <div>
    ${item.rights} * ${item.published_date}
    </div>
    </div>
    </div>`;
  //array to string js : 타입변환해 ',' 없애기
  }).join("");
  

  document.getElementById("news-board").innerHTML = newsHTML;

};

//키워드검색 클릭이벤트
searchButton.addEventListener("click", getNewsByKeyword);

getLatesNews();

