/*
 * 여행 후보지 데이터 스키마 v1
 * - 새 후보지는 places 배열에 추가합니다.
 * - 새 후보지는 Google Sheets에서 관리하고 GitHub Actions로 동기화합니다.
 * - name은 일정 데이터의 item.placeName과 매칭되므로 고유하게 유지합니다.
 * - 필수값: name, city, area, category, people, lat, lng, note
 * - 선택값: aliases, mapUrl
 */
window.TRIP_PLACES = {
  schemaVersion: 1,
  places: [
    { name:"도초지", city:"후쿠오카", area:"기온·카와바타", category:"볼거리", people:["예담"], lat:33.5952317, lng:130.4138692, note:"거대 목조 불상이 있는 유서 깊은 사찰" },
    { name:"쇼후쿠지", city:"후쿠오카", area:"기온·카와바타", category:"볼거리", people:["예담"], lat:33.5970079, lng:130.4142019, note:"일본에서 가장 오래된 고즈넉한 선종 사찰" },
    { name:"하카타 향토관", city:"후쿠오카", area:"기온·카와바타", category:"체험", people:["예담"], lat:33.59335, lng:130.41134, note:"하카타의 전통 공예와 축제 문화를 보는 곳" },
    { name:"구시다 신사", city:"후쿠오카", area:"기온·카와바타", category:"볼거리", people:["예담"], lat:33.59307, lng:130.4106837, note:"축제용 거대 가마가 상시 전시된 수호 신사" },
    { name:"카와바타 상점가", city:"후쿠오카", area:"기온·카와바타", category:"쇼핑", people:["예담"], lat:33.5941, lng:130.40845, note:"전통 상점과 맛집이 모인 아케이드 거리" },
    { name:"하카타 리버레인", city:"후쿠오카", area:"기온·카와바타", category:"쇼핑", people:["예담"], lat:33.5950381, lng:130.4057596, note:"호빵맨 박물관과 아시아 미술관이 있는 쇼핑몰" },
    { name:"스미요시 신사", city:"후쿠오카", area:"하카타역 남측", category:"볼거리", people:["예담"], lat:33.5857544, lng:130.4134348, note:"도심 속 울창한 숲에 둘러싸인 고요한 신사" },
    { name:"라쿠스이엔", city:"후쿠오카", area:"하카타역 남측", category:"체험", people:["예담"], lat:33.5865548, lng:130.4132676, note:"전통 정원을 바라보며 말차 체험을 하는 곳" },
    { name:"캐널시티 하카타", city:"후쿠오카", area:"하카타·나카스", category:"쇼핑", people:["예담","정우"], lat:33.5896715, lng:130.411141, note:"운하와 분수 쇼가 있는 대형 쇼핑몰 · 정우 9순위" },
    { name:"나카강변 & 나카스 야타이", aliases:"나카스 강변", city:"후쿠오카", area:"나카스", category:"맛집", people:["예담","정우"], lat:33.5913939, lng:130.4070634, note:"강변 야경과 포장마차를 함께 즐기는 야간 명소 · 정우 8순위" },
    { name:"풀풀하카타", city:"후쿠오카", area:"기온", category:"카페", people:["예담"], lat:33.59215, lng:130.41345, note:"명란 바게트가 궁금한 베이커리" },
    { name:"베이사이드 플레이스 하카타", city:"후쿠오카", area:"부두·베이사이드", category:"체험", people:["예담","진서"], lat:33.604023, lng:130.3987274, note:"대형 타워 수족관이 있는 항구 복합 시설", mapUrl:"https://maps.app.goo.gl/A8KwjJkHmGjFkvjK9" },
    { name:"하카타 토요이치", city:"후쿠오카", area:"부두·베이사이드", category:"맛집", people:["예담"], lat:33.60386, lng:130.39895, note:"항구 옆의 가성비 좋은 인기 스시 매장" },
    { name:"나미하노유 온천", city:"후쿠오카", area:"부두·베이사이드", category:"체험", people:["예담"], lat:33.6037395, lng:130.3981185, note:"하카타항 바로 앞에서 즐기는 천연 온천" },
    { name:"텐진 지하상가", city:"후쿠오카", area:"텐진", category:"쇼핑", people:["예담","정우"], lat:33.5896437, lng:130.3997043, note:"카페·잡화·드럭스토어가 모인 대규모 지하상가 · 정우 4순위" },
    { name:"스이쿄텐만구", city:"후쿠오카", area:"텐진", category:"볼거리", people:["예담"], lat:33.5924309, lng:130.4019114, note:"텐진 지명의 유래가 된 도심 속 작은 신사" },
    { name:"후쿠오카 성터", city:"후쿠오카", area:"오호리·마이즈루", category:"볼거리", people:["예담"], lat:33.58438, lng:130.3831, note:"성벽 위에서 시내를 조망할 수 있는 곳" },
    { name:"오호리 공원", city:"후쿠오카", area:"오호리", category:"산책", people:["예담","정우","진서"], lat:33.5862065, lng:130.3764646, note:"호수 산책과 카페, 편의점 피크닉이 좋은 모두의 픽 · 정우 6순위", mapUrl:"https://maps.app.goo.gl/51S4WNsY7jugEH276" },
    { name:"후쿠오카 타워", city:"후쿠오카", area:"모모치", category:"볼거리", people:["예담","정우"], lat:33.5932744, lng:130.3514862, note:"거울 유리 외관의 전망 타워 · 저녁 방문 후보 · 정우 5순위" },
    { name:"시사이드 모모치 해변공원", city:"후쿠오카", area:"모모치", category:"산책", people:["예담"], lat:33.5948717, lng:130.3507794, note:"이국적인 건축물과 바다의 일몰 명소" },
    { name:"다이묘 거리", city:"후쿠오카", area:"다이묘", category:"산책", people:["예담"], lat:33.590326, lng:130.3948297, note:"가볍게 상점과 골목을 돌아다니기 좋은 동네" },
    { name:"야쿠인 거리", city:"후쿠오카", area:"야쿠인", category:"산책", people:["예담"], lat:33.5824351, lng:130.401673, note:"카페와 작은 상점을 따라 걸어볼 후보" },
    { name:"난조인", city:"후쿠오카", area:"근교·사사구리", category:"볼거리", people:["예담"], lat:33.61755, lng:130.57225, note:"대형 청동 와불상이 있는 사찰 · 시내에서 먼 근교" },
    { name:"다자이후 텐만구", city:"후쿠오카", area:"근교·다자이후", category:"볼거리", people:["예담"], lat:33.52134, lng:130.53526, note:"학업 성취를 기원하는 매화 명소 신사" },
    { name:"포켓몬센터 후쿠오카", city:"후쿠오카", area:"하카타역·하카타 마루이 2F", category:"쇼핑", people:["정우"], lat:33.5888887, lng:130.4194425, note:"정우 1순위 · 쇼핑·체험 최우선 후보" },
    { name:"TCG 전문점 트레카블루", city:"후쿠오카", area:"카와바타", category:"쇼핑", people:["정우"], lat:33.59522, lng:130.40763, note:"정우 2순위 · 오리파가 가성비 좋은 TCG 숍" },
    { name:"미나텐진", city:"후쿠오카", area:"텐진", category:"쇼핑", people:["정우"], lat:33.5931863, lng:130.3983203, note:"정우 3순위 · 가성비 브랜드 중심 쇼핑몰" },
    { name:"다이마루 백화점 텐진", city:"후쿠오카", area:"텐진", category:"쇼핑", people:["정우"], lat:33.588641, lng:130.4020635, note:"정우 7순위 · 디저트와 간식 쇼핑, 면세 체크" },
    { name:"돈키호테 나카스점", aliases:"돈키호테 하카타 텐진점", city:"후쿠오카", area:"나카스", category:"쇼핑", people:["정우"], lat:33.59416, lng:130.40662, note:"정우 10순위 · 대형 돈키호테 후보" },
    { name:"타워레코즈 아뮤플라자 하카타", city:"후쿠오카", area:"하카타역", category:"쇼핑", people:["정우"], lat:33.590682, lng:130.4198639, note:"정우 11순위 · J-POP부터 폭넓게 보는 음반 숍" },
    { name:"오니기리 고리짱 후쿠오카", city:"후쿠오카", area:"와타나베도리", category:"맛집", people:["정우"], lat:33.5829, lng:130.4052, note:"먹고 싶은 곳 1순위 · 속재료가 푸짐한 오니기리" },
    { name:"모토무라 규카츠", city:"후쿠오카", area:"텐진·다이묘", category:"맛집", people:["정우"], lat:33.58955, lng:130.39555, note:"먹고 싶은 곳 2순위 · 인기 규카츠집" },
    { name:"후쿠오카 에비스야 우동", city:"후쿠오카", area:"스미요시", category:"맛집", people:["정우"], lat:33.5861, lng:130.4113, note:"먹고 싶은 곳 3순위 · 현지 평점이 좋은 우동 후보" },
    { name:"후쿠오카 니쿠젠", city:"후쿠오카", area:"아카사카·다이묘", category:"맛집", people:["정우"], lat:33.5894637, lng:130.3907075, note:"먹고 싶은 곳 4순위 · 야키니쿠 무한리필" },
    { name:"원조 하카타 멘타이쥬", city:"후쿠오카", area:"니시나카스", category:"맛집", people:["정우"], lat:33.59093, lng:130.40355, note:"먹고 싶은 곳 5순위 · 명란 덮밥으로 유명한 곳" },
    { name:"REC COFFEE 현청동점", aliases:"REC COFFEE Fukuoka Prefecture East Shop", city:"후쿠오카", area:"히가시코엔", category:"카페", people:["진서"], lat:33.6083397, lng:130.4202976, note:"진서가 고른 커피 스폿", mapUrl:"https://maps.app.goo.gl/VfMRnKaCV83R3HST8" },
    { name:"야오키빵", city:"후쿠오카", area:"하코자키", category:"카페", people:["진서"], lat:33.61933, lng:130.4232167, note:"진서가 고른 동네 빵집", mapUrl:"https://maps.app.goo.gl/9b2HQChW1SR689AX7" },
    { name:"하카타 음식문화박물관 하쿠하쿠", city:"후쿠오카", area:"하코자키", category:"체험", people:["진서"], lat:33.6132965, lng:130.433319, note:"하카타의 음식과 문화를 보는 박물관", mapUrl:"https://maps.app.goo.gl/WaLfYKNFsKmudh8P8" },
    { name:"하카타 모츠나베 오오야마 본점", city:"후쿠오카", area:"고후쿠마치", category:"맛집", people:["진서"], lat:33.5966724, lng:130.4097118, note:"진서가 고른 모츠나베 본점", mapUrl:"https://maps.app.goo.gl/6AiaR5CvpxWVudL99" },
    { name:"구마모토성", city:"구마모토", area:"주오구", category:"볼거리", people:["진서"], lat:32.8061859, lng:130.7058335, note:"일본 3대 명성 중 하나로 웅장한 석벽이 유명한 성", mapUrl:"https://maps.app.goo.gl/ANMVXhq3kjSGwHnVA" },
    { name:"스이젠지 조주엔", city:"구마모토", area:"스이젠지", category:"산책", people:["진서"], lat:32.7911584, lng:130.7333645, note:"구마모토의 전통 회유식 정원", mapUrl:"https://maps.app.goo.gl/gRGbpoqYxcZRcMDs6" },
    { name:"몽키 D. 루피 동상", city:"구마모토", area:"구마모토현청", category:"볼거리", people:["진서"], lat:32.789011, lng:130.7413031, note:"구마모토현청 앞 원피스 루피 동상", mapUrl:"https://maps.app.goo.gl/5jnVYE46d2wq2hc17" },
    { name:"구마모토시 동식물원", city:"구마모토", area:"에즈코", category:"체험", people:["진서"], lat:32.7745613, lng:130.7476687, note:"동물원과 식물원을 함께 보는 곳", mapUrl:"https://maps.app.goo.gl/4VL2sziobtvDYcLd7" },
    { name:"쵸파 동상", city:"구마모토", area:"에즈코", category:"볼거리", people:["진서"], lat:32.776109, lng:130.7503989, note:"구마모토 동식물원의 원피스 쵸파 동상", mapUrl:"https://maps.app.goo.gl/8eHHseUFsiiPBxjR7" },
    { name:"야키토리 데지마", aliases:"やきとり出島", city:"나가사키", area:"데지마", category:"맛집", people:["진서"], lat:32.8175706, lng:129.8451707, note:"진서가 고른 나가사키 야키토리집", mapUrl:"https://maps.app.goo.gl/McWCGiwKjsFE1bJZA" },
    { name:"분지로 아사히마치점", city:"나가사키", area:"아사히마치", category:"맛집", people:["진서"], lat:32.7495154, lng:129.8646494, note:"진서가 고른 나가사키 돈카츠 맛집", mapUrl:"https://maps.app.goo.gl/DdL2pUPcGHfS2tFH7" }
  ]
};
