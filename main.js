//NEWS API 호출함수
//new URL() 객체 생성
//async 사용
let news = []; //article만 보여주기
let page = 1;
let total_pages = 0;
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
  //에러 핸들링(try~catch)
  try{
    
    //new Headers() : api key 넣기
    let header = new Headers({"x-api-key":"iTv6o8c51joER-y0qxhwVuf-7ARg_lUqHvxLOsD0nW0"})
    
    //서버에 요청한 데이터를 가져오기 전까지 실행 x => async / await 사용
    //await 사용
    //url에 page query 넣기 : url.searchParams.set('x',x);
    url.searchParams.set('page', page);
    console.log("url",url);
    let response = await fetch(url,{headers:header});  //ajax, http, fetch 등 사용
    //json type
    let data = await response.json();
    //정상일때
    if(response.status == 200){
      //콘솔로 검색결과가 나오지 않을때 상태값 확인 후 설정
      if(data.total_hits == 0){
        throw new Error("검색된 결과값이 없습니다")
      }
      news = data.articles;
      page = data.page;
      total_pages = data.total_pages;
      console.log(news);
      render();
      pagination();
    }else{
      throw new Error(data.message);
    }  
    
  }catch(error){
    console.log("에러 : ",error.message);
    errorRender(error.message);
  }

};

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

//에러 메세지 출력
const errorRender = (message) =>{
  let errorHTML = `<div class="alert alert-danger text-center fs-1 fw-bolder" role="alert">
  ${message}
</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

//페이징
const pagination = ()=>{

  let paginationHTML = ``;

  //total page : 여기에서는 total_pages라고 쓰넹
  //page group : Math.ceil -> 올림
  let pageGroup = Math.ceil(page/10);
  //last page
  let last = pageGroup*10
  //first page
  let first = last - 9

  //first~last page print
  //화살표 넣기 < >
  paginationHTML = `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`;
  //현재페이지 표시(삼항연산)
  for(let i = first; i<=last; i++){
    paginationHTML+= `<li class="page-item ${page == i? "active" : ""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  
  }
  paginationHTML += `<li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page+1})">
    <span aria-hidden="true">&gt;</span>
  </a>
</li>`;
  document.querySelector(".pagination").innerHTML = paginationHTML
};

  //total page가 설정한 페이지 그룹수보다 적을때
  
  //화살표 넣기 << >>

  //첫번째 그룹일 때 << < 버튼 없애기

  //마지막 그룹일 때 >> > 버튼 없애기

const moveToPage = (pageNum) =>{
  //1)이동하고 싶은 페이지 확인
  page = pageNum;

  //2)api 다시 호출 : getNews
  getNews();

  //3)
}


//키워드검색 클릭이벤트
searchButton.addEventListener("click", getNewsByKeyword);

getLatesNews();

