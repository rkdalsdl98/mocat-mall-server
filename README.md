유저 레포지토리 루틴 모두 만들었음
CRUD 뼈대 만들었음 (무조건 다듬어야 함)
유저와 서버간의 객체 매핑을 위한 Dto 만들어야 함
(Dto와 Entity간의 필터 타입이 필요함)  
유저 서비스에 레디스 적용  
쿠폰 등록 루틴 만듬  
+ 게시판
+ 주문
+ 상품

쿠폰 CRUD 뼈대 만듬  
쿠폰 서비스쪽 쿠폰 생성 루틴 확립  

쿠폰 레포지토리 정리  
쿠폰 서비스 루틴 확립  
쿠폰 라우터 분리  
쿠폰 서비스에 레디스 적용  

현재 라우터 파라미터가 내부에서 쓰이는 옵션으로 사용되고 있는데  
모두 Dto 형식을 만들어 바꾸어야 함

모든 요청에는 유저 로깅을 위한 이메일과 이름을 받아야 함  

스웨거 세팅 뼈대 만듬  
유저, 쿠폰 요청 응답 Dto 생성  
Dto 클래스화, fromEntity 루틴 적용  

유저가 자신이 작성한 게시글의 모든 정보를 가지고 있을 필요는 없음  
조회가 가능하게끔 게시글의 아이디같은 메타정보를 포함만 해도 됨  

게시판 라우터 분할  
게시판 서비스 루틴 작성  
게시판 레포지토리 작성  
게시판 레디스 적용  

******** ***해야함*** ********  
유저가 가지는 자기가 작성한 게시글 정보 변경  
게시글의 모든정보 -> 게시글의 메타정보(프리즈마 변경 필요 함)  

*서버 로드할때 Redis캐시에 DB에 있는 모든 정보 로드를 했다는 가정하에 작성*