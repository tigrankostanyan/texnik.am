import { Language } from '../types';

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
  addressDetails?: {
    road?: string;
    houseNumber?: string;
    suburb?: string;
    city?: string;
    country?: string;
  };
}

// Popular locations and streets in Armenia for instant autocomplete & offline fallback
const POPULAR_ARMENIA_LOCATIONS: { nameHy: string; nameRu: string; nameEn: string; lat: number; lng: number; district?: string }[] = [
  // Central Yerevan Streets
  { nameHy: 'ք. Երևան, Աբովյան փողոց', nameRu: 'г. Ереван, ул. Абовяна', nameEn: 'Yerevan, Abovyan Street', lat: 40.1832, lng: 44.5173, district: 'Կենտրոն' },
  { nameHy: 'ք. Երևան, Հանրապետության Հրապարակ', nameRu: 'г. Ереван, Площадь Республики', nameEn: 'Yerevan, Republic Square', lat: 40.1776, lng: 44.5126, district: 'Կենտրոն' },
  { nameHy: 'ք. Երևան, Մաշտոցի պողոտա', nameRu: 'г. Ереван, проспект Маштоца', nameEn: 'Yerevan, Mashtots Avenue', lat: 40.1856, lng: 44.5098, district: 'Կենտրոն' },
  { nameHy: 'ք. Երևան, Բաղրամյան պողոտա', nameRu: 'г. Ереван, проспект Баграмяна', nameEn: 'Yerevan, Baghramyan Avenue', lat: 40.1917, lng: 44.5050, district: 'Արաբկիր / Կենտրոն' },
  { nameHy: 'ք. Երևան, Թումանյան փողոց', nameRu: 'г. Եреван, ул. Туманяна', nameEn: 'Yerevan, Tumanyan Street', lat: 40.1824, lng: 44.5142, district: 'Կենտրոն' },
  { nameHy: 'ք. Երևան, Կոմիտասի պողոտա', nameRu: 'г. Ереван, проспект Комитаса', nameEn: 'Yerevan, Komitas Avenue', lat: 40.2078, lng: 44.5148, district: 'Արաբկիր' },
  { nameHy: 'ք. Երևան, Սայաթ-Նովայի պողոտա', nameRu: 'г. Ереван, проспект Саят-Новы', nameEn: 'Yerevan, Sayat-Nova Avenue', lat: 40.1841, lng: 44.5207, district: 'Կենտրոն' },
  { nameHy: 'ք. Երևան, Ամիրյան փողոց', nameRu: 'г. Ереван, ул. Амиряна', nameEn: 'Yerevan, Amiryan Street', lat: 40.1784, lng: 44.5074, district: 'Կենտրոն' },
  { nameHy: 'ք. Երևան, Տիգրան Մեծի պողոտա', nameRu: 'г. Ереван, проспект Тиграна Меца', nameEn: 'Yerevan, Tigran Mets Avenue', lat: 40.1695, lng: 44.5165, district: 'Կենտրոն / Էրեբունի' },
  { nameHy: 'ք. Երևան, Նալբանդյան փողոց', nameRu: 'г. Ереван, ул. Налбандяна', nameEn: 'Yerevan, Nalbandyan Street', lat: 40.1818, lng: 44.5186, district: 'Կենտրոն' },
  { nameHy: 'ք. Երևան, Խանջյան փողոց', nameRu: 'г. Ереван, ул. Ханджяна', nameEn: 'Yerevan, Khanjyan Street', lat: 40.1780, lng: 44.5220, district: 'Կենտրոն' },
  { nameHy: 'ք. Երևան, Հյուսիսային պողոտա', nameRu: 'г. Ереван, Северный проспект', nameEn: 'Yerevan, Northern Avenue', lat: 40.1822, lng: 44.5144, district: 'Կենտրոն' },
  { nameHy: 'ք. Երևան, Ազատության պողոտա', nameRu: 'г. Ереван, проспект Азатутян', nameEn: 'Yerevan, Azatutyan Avenue', lat: 40.2033, lng: 44.5262, district: 'Քանաքեռ-Զեյթուն' },
  { nameHy: 'ք. Երևան, Դավիթ Անհաղթի փողոց', nameRu: 'г. Ереван, ул. Давида Анахта', nameEn: 'Yerevan, Davit Anhaght Street', lat: 40.2045, lng: 44.5320, district: 'Քանաքեռ-Զեյթուն' },
  { nameHy: 'ք. Երևան, Գայի պողոտա', nameRu: 'г. Ереван, проспект Гая', nameEn: 'Yerevan, Gai Avenue', lat: 40.1989, lng: 44.5615, district: 'Նոր Նորք' },
  { nameHy: 'ք. Երևան, Ռուբինյանց փողոց', nameRu: 'г. Ереван, ул. Рубинянца', nameEn: 'Yerevan, Rubinyants Street', lat: 40.2132, lng: 44.5450, district: 'Քանաքեռ-Զեյթուն' },
  { nameHy: 'ք. Երևան, Տիգրան Պետրոսյան փողոց', nameRu: 'г. Ереван, ул. Тиграна Петросяна', nameEn: 'Yerevan, Tigran Petrosyan Street', lat: 40.2170, lng: 44.4750, district: 'Դավթաշեն' },
  { nameHy: 'ք. Երևան, Կիևյան փողոց', nameRu: 'г. Ереван, ул. Киевян', nameEn: 'Yerevan, Kievyan Street', lat: 40.1965, lng: 44.4920, district: 'Արաբկիր' },
  { nameHy: 'ք. Երևան, Սեբաստիայի փողոց', nameRu: 'г. Ереван, ул. Себастия', nameEn: 'Yerevan, Sebastia Street', lat: 40.1770, lng: 44.4620, district: 'Մալաթիա-Սեբաստիա' },
  { nameHy: 'ք. Երևան, Լենինգրադյան փողոց', nameRu: 'г. Ереван, ул. Ленинградян', nameEn: 'Yerevan, Leningradian Street', lat: 40.1920, lng: 44.4760, district: 'Աջափնյակ' },
  { nameHy: 'ք. Երևան, Գարեգին Նժդեհի հրապարակ', nameRu: 'г. Ереван, площадь Гарегина Нжде', nameEn: 'Yerevan, Garegin Nzhdeh Square', lat: 40.1510, lng: 44.4840, district: 'Շենգավիթ' },
  { nameHy: 'ք. Երևան, Արշակունյաց պողոտա', nameRu: 'г. Ереван, проспект Аршакуняц', nameEn: 'Yerevan, Arshakunyats Avenue', lat: 40.1610, lng: 44.5020, district: 'Շենգավիթ' },
  { nameHy: 'ք. Երևան, Ծովակալ Իսակովի պողոտա', nameRu: 'г. Ереван, проспект Адмирала Исакова', nameEn: 'Yerevan, Isakov Avenue', lat: 40.1650, lng: 44.4780, district: 'Մալաթիա' },
  { nameHy: 'ք. Երևան, Էրեբունի փողոց', nameRu: 'г. Ереван, ул. Эребуни', nameEn: 'Yerevan, Erebuni Street', lat: 40.1460, lng: 44.5260, district: 'Էրեբունի' },
  { nameHy: 'ք. Երևան, Թբիլիսյան խճուղի', nameRu: 'г. Ереван, Тбилисское шоссе', nameEn: 'Yerevan, Tbilisi Highway', lat: 40.2280, lng: 44.5360, district: 'Քանաքեռ-Զեյթուն' },
  { nameHy: 'ք. Երևան, Դավթաշեն 1-ին թաղամաս', nameRu: 'г. Ереван, Давташен 1-й квартал', nameEn: 'Yerevan, Davtashen 1st District', lat: 40.2140, lng: 44.4820, district: 'Դավթաշեն' },
  { nameHy: 'ք. Երևան, Նոր Նորքի 1-ին զանգված', nameRu: 'г. Ереван, 1-й массив Нор Норка', nameEn: 'Yerevan, Nor Nork 1st Microdistrict', lat: 40.1960, lng: 44.5680, district: 'Նոր Նորք' },
  { nameHy: 'ք. Գյումրի, Վարդանանց հրապարակ', nameRu: 'г. Гюмри, площадь Вардананц', nameEn: 'Gyumri, Vardanants Square', lat: 40.7850, lng: 43.8410, district: 'Գյումրի' },
  { nameHy: 'ք. Վանաձոր, Հայքի հրապարակ', nameRu: 'г. Ванадзор, площадь Айка', nameEn: 'Vanadzor, Hayq Square', lat: 40.8075, lng: 44.4970, district: 'Վանաձոր' },
];

/**
 * Searches for addresses in Armenia using Nominatim OSM API + instant offline fallback
 */
export async function searchAddresses(query: string, lang: Language = 'hy'): Promise<GeocodingResult[]> {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return [];

  // Filter offline locations first
  const offlineMatches: GeocodingResult[] = POPULAR_ARMENIA_LOCATIONS.filter((loc) => {
    const matchHy = loc.nameHy.toLowerCase().includes(cleanQ);
    const matchRu = loc.nameRu.toLowerCase().includes(cleanQ);
    const matchEn = loc.nameEn.toLowerCase().includes(cleanQ);
    const matchDist = loc.district ? loc.district.toLowerCase().includes(cleanQ) : false;
    return matchHy || matchRu || matchEn || matchDist;
  }).map((loc) => ({
    lat: loc.lat,
    lng: loc.lng,
    displayName: lang === 'ru' ? loc.nameRu : lang === 'en' ? loc.nameEn : loc.nameHy,
  }));

  // Try live Nominatim OpenStreetMap Geocoding
  try {
    const langCode = lang === 'ru' ? 'ru' : lang === 'en' ? 'en' : 'hy';
    const searchQuery = cleanQ.includes('armenia') || cleanQ.includes('yerevan') || cleanQ.includes('երևան') || cleanQ.includes('ереван')
      ? cleanQ
      : `${cleanQ}, Yerevan, Armenia`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=am&addressdetails=1&limit=5&accept-language=${langCode}`,
      {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const liveResults: GeocodingResult[] = data.map((item: any) => {
          const road = item.address?.road || item.address?.pedestrian || item.address?.street;
          const house = item.address?.house_number;
          const city = item.address?.city || item.address?.town || item.address?.village || 'ք. Երևան';
          const suburb = item.address?.suburb || item.address?.neighbourhood;

          let formatted = item.display_name;
          if (road) {
            formatted = `${city ? city + ', ' : ''}${road}${house ? ' ' + house : ''}${suburb ? ` (${suburb})` : ''}`;
          }

          return {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            displayName: formatted,
            addressDetails: {
              road,
              houseNumber: house,
              suburb,
              city,
              country: item.address?.country,
            },
          };
        });

        // Combine live results with offline matches without duplicates
        const combined = [...liveResults];
        offlineMatches.forEach((off) => {
          const exists = combined.some((c) => Math.abs(c.lat - off.lat) < 0.002 && Math.abs(c.lng - off.lng) < 0.002);
          if (!exists) combined.push(off);
        });

        return combined.slice(0, 6);
      }
    }
  } catch {
    // Network or timeout error, gracefully fall back to offline dictionary
  }

  return offlineMatches.slice(0, 6);
}

/**
 * Reverse geocodes coordinates to a clean street address
 */
export async function reverseGeocode(lat: number, lng: number, lang: Language = 'hy'): Promise<string> {
  // Check closest known landmark/street within ~300m
  let closestDist = Infinity;
  let closestLoc: typeof POPULAR_ARMENIA_LOCATIONS[0] | null = null;

  for (const loc of POPULAR_ARMENIA_LOCATIONS) {
    const d = Math.sqrt(Math.pow(loc.lat - lat, 2) + Math.pow(loc.lng - lng, 2));
    if (d < closestDist) {
      closestDist = d;
      closestLoc = loc;
    }
  }

  try {
    const langCode = lang === 'ru' ? 'ru' : lang === 'en' ? 'en' : 'hy';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=${langCode}&addressdetails=1`,
      {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const road = data.address.road || data.address.pedestrian || data.address.street;
        const house = data.address.house_number;
        const city = data.address.city || data.address.town || data.address.village || 'ք. Երևան';
        const suburb = data.address.suburb || data.address.neighbourhood;

        if (road) {
          return `${city}, ${road}${house ? ' ' + house : ''}${suburb ? ` (${suburb})` : ''}`;
        }
        if (data.display_name) {
          const parts = data.display_name.split(',');
          return parts.slice(0, 3).join(', ').trim();
        }
      }
    }
  } catch {
    // Fallback below
  }

  // Fallback to closest known landmark if within ~800m
  if (closestLoc && closestDist < 0.008) {
    const baseName = lang === 'ru' ? closestLoc.nameRu : lang === 'en' ? closestLoc.nameEn : closestLoc.nameHy;
    return `${baseName}`;
  }

  const prefix = lang === 'ru' ? 'г. Ереван, точка' : lang === 'en' ? 'Yerevan, Point' : 'ք. Երևան, Կետ';
  return `${prefix} (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}
