
export async function fetchEvents() {
  try {
    const res = await fetch(
      "https://positive-health-719181f708.strapiapp.com/api/events?populate=*"
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const json = await res.json();
    console.log("raw events json:", json);

    const items = Array.isArray(json.data) ? json.data : json.data?.data || [];
    const eventsMap = {};

    items.forEach((item) => {
    
      const attrs = item.attributes ?? item;

      const dateStr =
        attrs?.Date ??
        attrs?.date ??
        attrs?.date_time ??
        attrs?.datetime ??
        attrs?.time;

      if (!dateStr) {
        console.warn("Skipping event (no date):", item);
        return;
      }

      const d = new Date(dateStr);
      if (isNaN(d)) {
        console.warn("Skipping event (invalid date):", dateStr, item);
        return;
      }

      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

      const eventObj = {
        id:
          item.id ??
          attrs.id ??
          `${key}-${Math.random().toString(36).slice(2, 7)}`,
        isoDate: dateStr,
        dateObj: d,
        title: attrs?.Details ?? attrs?.details ?? attrs?.title ?? "Event",
        location: attrs?.Location ?? attrs?.location ?? attrs?.place ?? "TBA",
        raw: attrs,
      };

      if (!eventsMap[key]) eventsMap[key] = [];
      eventsMap[key].push(eventObj);
    });

    console.log("formatted eventsMap:", eventsMap);
    return eventsMap;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return {};
  }
}
