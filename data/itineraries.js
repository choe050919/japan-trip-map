/*
 * 여행 계획 데이터 스키마 v1
 * - 새 계획은 plans 배열에 추가합니다.
 * - item.placeName이 후보지 데이터의 name과 같으면 기존 좌표와 태그를 재사용합니다.
 * - 후보지에 없는 장소는 item.lat / item.lng를 직접 지정합니다.
 * - kind: place | anchor | meal | transfer | note
 */
window.TRIP_ITINERARIES = {
  schemaVersion: 1,
  plans: [
    {
      id: "gemini-1",
      name: "Gemini 1안",
      source: "Gemini1.txt",
      startDate: "2026-06-26",
      endDate: "2026-07-01",
      description: "하카타 전통 문화·베이사이드와 오호리·텐진·나카스를 잇는 2일 계획",
      days: [
        {
          id: "gemini-1-day-1",
          dayNumber: 1,
          date: "2026-06-26",
          title: "하카타 전통 문화 & 베이사이드 항구 코스",
          color: "#f36f45",
          summary: "하카타역 북측 역사 지구를 걸은 뒤 99번 버스로 베이사이드에 이동해 온천으로 마무리합니다.",
          tips: [
            "하카타역 코인라커에 캐리어를 보관하면 이동이 편합니다.",
            "하카타 리버레인 앞에서 99번 버스를 타면 베이사이드까지 환승 없이 이동할 수 있습니다."
          ],
          items: [
            {
              id: "d1-airport-arrival",
              kind: "anchor",
              start: "08:00",
              end: "09:30",
              title: "후쿠오카 공항 도착",
              lat: 33.58594,
              lng: 130.45069,
              details: "입국 수속 후 하카타역으로 이동",
              transit: "공항 → 하카타역"
            },
            {
              id: "d1-pokemon-center",
              kind: "place",
              start: "09:30",
              end: "11:30",
              title: "하카타역 · 포켓몬센터",
              placeName: "포켓몬센터 후쿠오카",
              details: "아뮤플라자와 포켓몬센터 쇼핑"
            },
            {
              id: "d1-lunch",
              kind: "meal",
              start: "11:30",
              end: "13:30",
              title: "점심 식사",
              details: "하카타역 근처 식당 이용"
            },
            {
              id: "d1-tochoji",
              kind: "place",
              start: "13:30",
              end: "14:00",
              title: "도초지",
              placeName: "도초지",
              details: "거대 목조 불상 관람",
              transit: "하카타역에서 도보 약 10분 또는 지하철 기온역"
            },
            {
              id: "d1-folk-museum",
              kind: "place",
              start: "14:05",
              end: "14:40",
              title: "하카타 향토관",
              placeName: "하카타 향토관",
              details: "전통 공예와 축제 문화 관람",
              transit: "도초지에서 도보 약 5분"
            },
            {
              id: "d1-kushida",
              kind: "place",
              start: "14:40",
              end: "15:10",
              title: "구시다 신사",
              placeName: "구시다 신사",
              details: "카자리야마 전시 관람",
              transit: "향토관 바로 옆"
            },
            {
              id: "d1-kawabata",
              kind: "place",
              start: "15:10",
              end: "15:35",
              title: "카와바타 상점가",
              placeName: "카와바타 상점가",
              details: "전통 상점가 아케이드 산책",
              transit: "구시다 신사에서 도보 1~2분"
            },
            {
              id: "d1-riverain",
              kind: "place",
              start: "15:35",
              end: "16:00",
              title: "하카타 리버레인",
              placeName: "하카타 리버레인",
              details: "리버레인과 아시아 미술관 주변 구경"
            },
            {
              id: "d1-bayside-transfer",
              kind: "transfer",
              start: "16:00",
              end: "16:30",
              title: "베이사이드로 이동",
              details: "카와바타마치·하카타리버레인 앞에서 99번 버스 탑승",
              transit: "99번 버스 · 약 15분"
            },
            {
              id: "d1-bayside",
              kind: "place",
              start: "16:30",
              end: "17:00",
              title: "베이사이드 플레이스 하카타",
              placeName: "베이사이드 플레이스 하카타",
              details: "타워 수족관과 항구 복합 시설 구경"
            },
            {
              id: "d1-toyoichi",
              kind: "place",
              start: "17:00",
              end: "17:30",
              title: "하카타 토요이치",
              placeName: "하카타 토요이치",
              details: "스시 포장 또는 간단한 간식"
            },
            {
              id: "d1-dinner",
              kind: "meal",
              start: "17:30",
              end: "19:30",
              title: "저녁 식사",
              details: "베이사이드 주변 또는 이동 후 식사"
            },
            {
              id: "d1-namiha",
              kind: "place",
              start: "19:30",
              end: "21:30",
              title: "나미하노유 온천",
              placeName: "나미하노유 온천",
              details: "천연 온천에서 휴식 후 숙소로 이동"
            }
          ]
        },
        {
          id: "gemini-1-day-2",
          dayNumber: 2,
          date: "2026-06-27",
          title: "오호리 공원 힐링 & 텐진·나카스 쇼핑 코스",
          color: "#4779d4",
          summary: "오호리와 성터를 산책하고 텐진·하카타 남측·캐널시티를 지나 나카스 야경으로 마무리합니다.",
          tips: [
            "오호리 공원과 후쿠오카 성터는 많이 걷게 되므로 편한 신발이 좋습니다."
          ],
          items: [
            {
              id: "d2-ohori",
              kind: "place",
              start: "09:30",
              end: "11:30",
              title: "오호리 공원 & 시립미술관",
              placeName: "오호리 공원",
              details: "호수 산책, 카페 또는 미술관 관람",
              transit: "숙소에서 지하철 오호리공원역"
            },
            {
              id: "d2-castle",
              kind: "place",
              start: "11:30",
              end: "12:15",
              title: "후쿠오카 성터",
              placeName: "후쿠오카 성터",
              details: "성벽 전망대에서 시내 조망",
              transit: "오호리 공원에서 도보"
            },
            {
              id: "d2-lunch",
              kind: "meal",
              start: "12:15",
              end: "14:15",
              title: "점심 식사",
              details: "오호리 주변 또는 텐진 이동 후 식사"
            },
            {
              id: "d2-tenjin-underground",
              kind: "place",
              start: "14:15",
              end: "14:50",
              title: "텐진 지하상가",
              placeName: "텐진 지하상가",
              details: "유럽풍 지하상가 구경"
            },
            {
              id: "d2-mina",
              kind: "place",
              start: "14:50",
              end: "15:30",
              title: "미나텐진",
              placeName: "미나텐진",
              details: "쇼핑몰 구경"
            },
            {
              id: "d2-suikyo",
              kind: "place",
              start: "15:30",
              end: "16:00",
              title: "스이쿄텐만구",
              placeName: "스이쿄텐만구",
              details: "도심 속 작은 신사 둘러보기"
            },
            {
              id: "d2-sumiyoshi",
              kind: "place",
              start: "16:00",
              end: "16:20",
              title: "스미요시 신사",
              placeName: "스미요시 신사",
              details: "울창한 숲의 신사 산책",
              transit: "텐진에서 버스 또는 도보"
            },
            {
              id: "d2-rakusuien",
              kind: "place",
              start: "16:20",
              end: "16:40",
              title: "라쿠스이엔",
              placeName: "라쿠스이엔",
              details: "전통 정원, 시간 허락 시 말차 체험"
            },
            {
              id: "d2-tcg",
              kind: "place",
              start: "16:40",
              end: "17:00",
              title: "TCG 전문점 트레카블루",
              placeName: "TCG 전문점 트레카블루",
              details: "TCG 전문점 방문"
            },
            {
              id: "d2-canal-city",
              kind: "place",
              start: "17:00",
              end: "18:30",
              title: "캐널시티 하카타",
              placeName: "캐널시티 하카타",
              details: "쇼핑몰과 분수 쇼 관람",
              transit: "라쿠스이엔에서 도보 약 7~10분"
            },
            {
              id: "d2-dinner",
              kind: "meal",
              start: "18:30",
              end: "20:30",
              title: "저녁 식사",
              details: "캐널시티 내부 또는 나카스 주변 식당"
            },
            {
              id: "d2-nakasu",
              kind: "place",
              start: "20:30",
              end: "21:30",
              title: "나카강변 & 나카스 야타이",
              placeName: "나카강변 & 나카스 야타이",
              details: "네온사인 야경과 강변 산책 후 숙소 이동",
              transit: "캐널시티에서 도보"
            }
          ]
        }
      ]
    }
  ]
};
