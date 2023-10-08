******** ***진행상황*** ********  

리스폰 폼 작성  
유저 부분에 어떻게 사용할지 적용 해두었으니 보고 다른 곳도 맞추어 적용  
JWT 생성 작성  
회원가입 요청 처리  
로그인 루틴 작성  
JWT Access 생성, 검증 루틴 작성  
JWT 토큰 로그인 루틴 작성  
(서버에서 발행한 토큰인지 -> 유효기간이 만료된 토큰인지 -> 담긴 정보가 형식에 맞는지)  
요청에 따른 정해진 응답 타입 생성  
어드민 전용 스키마 적용하고 검증, 인증 루틴 작성  

******** ***해야함*** ********  

토큰 혹은 이외에 권한 관련 Guard에 정리  
어드민 권한 적용 방법 생각  


*서버 로드할때 Redis캐시에 DB에 있는 모든 정보 로드를 했다는 가정하에 작성*  

*JWT모듈을 사용하지 않은 이유는 모듈에서 사용된 환경변수 값을 읽어오지 못함*  


**어드민 권한 관련**
jwttoken = {email, hashcode}  
admintable = {uuid(pk), salt, code(단방향해쉬)}  


hashcode (decode) = 권한:otherhashcode  
otherhashcode (decode) = code  
code(verify by salt) compare code(admintable)  