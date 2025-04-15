import { Patient } from "../types";

function getFullYear(birthDate: Date | string) {
  const today = new Date();
  const birth = new Date(birthDate);

  if (isNaN(birth.getTime())) {
    return null;
  }

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

self.onmessage = (e: MessageEvent<{ data: Patient[] }>) => {
  const { data } = e.data;
  
  const diseaseData = [
    {
      name: "БП",
      value: data.filter((e) => e.bp).length,
      color: "indigo.6",
    },
    {
      name: "ДЭП",
      value: data.filter((e) => e.dep).length,
      color: "yellow.6",
    },
    {
      name: "Ишемия",
      value: data.filter((e) => e.ischemia).length,
      color: "teal.6",
    },
  ];

  const genderData = [
    {
      name: "Мужской",
      value: data.filter((e) => e.gender === "м" || e.gender === "М").length,
      color: "indigo.6",
    },
    {
      name: "Женский",
      value: data.filter((e) => e.gender === "ж" || e.gender === "Ж").length,
      color: "yellow.6",
    },
  ];

  const localityData = [
    {
      name: "Город",
      value: data.filter((e) => e.inhabited_locality === "Город").length,
      color: "indigo.6",
    },
    {
      name: "Район",
      value: data.filter((e) => e.inhabited_locality !== "Город").length,
      color: "yellow.6",
    },
  ];

  const diseaseByGenderData = [
    {
      gender: "М",
      БП: data.filter((e) => e.bp && (e.gender === "м" || e.gender === "М")).length,
      Ишемия: data.filter((e) => e.ischemia && (e.gender === "м" || e.gender === "М")).length,
      ДЭП: data.filter((e) => e.dep && (e.gender === "м" || e.gender === "М")).length,
    },
    {
      gender: "Ж",
      БП: data.filter((e) => e.bp && (e.gender === "ж" || e.gender === "Ж")).length,
      Ишемия: data.filter((e) => e.ischemia && (e.gender === "ж" || e.gender === "Ж")).length,
      ДЭП: data.filter((e) => e.dep && (e.gender === "ж" || e.gender === "Ж")).length,
    },
  ];

  const diseaseByLocalityData = [
    {
      inhabited_locality: "Город",
      БП: data.filter((e) => e.bp && e.inhabited_locality === "Город").length,
      Ишемия: data.filter((e) => e.ischemia && e.inhabited_locality === "Город").length,
      ДЭП: data.filter((e) => e.dep && e.inhabited_locality === "Город").length,
    },
    {
      inhabited_locality: "Район",
      БП: data.filter((e) => e.bp && e.inhabited_locality !== "Город").length,
      Ишемия: data.filter((e) => e.ischemia && e.inhabited_locality !== "Город").length,
      ДЭП: data.filter((e) => e.dep && e.inhabited_locality !== "Город").length,
    },
  ];

  const ages = Array.from(new Set(data.map((e) => getFullYear(e.birthday || ""))))
    .filter((age): age is number => age !== null)
    .sort((a, b) => a - b);

  const diseaseByAgeData = ages.map((age) => ({
    age,
    БП: data.filter((e) => getFullYear(e.birthday || "") === age && e.bp).length,
    ДЭП: data.filter((e) => getFullYear(e.birthday || "") === age && e.dep).length,
    Ишемия: data.filter((e) => getFullYear(e.birthday || "") === age && e.ischemia).length,
  }));

  self.postMessage({
    diseaseData,
    genderData,
    localityData,
    diseaseByGenderData,
    diseaseByLocalityData,
    diseaseByAgeData,
  });
}; 