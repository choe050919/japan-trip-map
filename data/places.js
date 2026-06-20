/*
 * 여행 후보지 데이터 스키마 v1
 * - 새 후보지는 Google Sheets에서 관리하고 GitHub Actions로 동기화합니다.
 * - name은 일정 데이터의 item.placeName과 매칭되므로 고유하게 유지합니다.
 * - 필수값: name, city, area, category, people, lat, lng, note
 * - 선택값: aliases, mapUrl
 */
window.TRIP_PLACES = {
  schemaVersion: 1,
  places: [
    { name:"후쿠오카 시 박물관", city:"후쿠오카", area:"미분류", category:"볼거리", people:["현승"], lat:33.589786, lng:130.353064, note:"박물관, 테스트용", mapUrl:"https://maps.app.goo.gl/GmyYFiSafahugpwk8" }
  ]
};
