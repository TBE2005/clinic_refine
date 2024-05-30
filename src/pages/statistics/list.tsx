import { L10n } from "@syncfusion/ej2-base";
import { Patient } from "../../types";
import api from "../../axios";
import React from "react";
import {
  RangeDirective,
  RangesDirective,
  SheetDirective,
  SheetsDirective,
  SpreadsheetComponent,
} from "@syncfusion/ej2-react-spreadsheet";
L10n.load({
  "ru-RU": {
    spreadsheet: {
      File: "Файл",
      Home: "Главная",
      Insert: "Вставить",
      Formulas: "Формулы",
      Data: "Данные",
      View: "Вид",
      Cut: "Вырезать",
      Copy: "Копировать",
      Paste: "Вставить",
      PasteSpecial: "Специальная вставка",
      All: "Все",
      Values: "Значения",
      Formats: "Форматы",
      Font: "Шрифт",
      FontSize: "Размер шрифта",
      Bold: "Полужирный",
      Italic: "Курсив",
      Underline: "Подчеркнутый",
      Strikethrough: "Зачеркнутый",
      TextColor: "Цвет текста",
      FillColor: "Цвет заливки",
      HorizontalAlignment: "Горизонтальное выравнивание",
      AlignLeft: "Выровнять по левому краю",
      AlignCenter: "По центру",
      AlignRight: "Выровнять по правому краю",
      VerticalAlignment: "Вертикальное выравнивание",
      AlignTop: "Выровнять по верхнему краю",
      AlignMiddle: "По середине",
      AlignBottom: "Выровнять по нижнему краю",
      InsertFunction: "Вставить функцию",
      Delete: "Удалить",
      Rename: "Переименовать",
      Hide: "Скрыть",
      Unhide: "Показать",
      NumberFormat: "Формат числа",
      SaveAs: "Сохранить как",
      Open: "Открыть",
      New: "Новый",
      Image: "Изображение",
      Chart: "График",
      Link: "Ссылка",
      CustomSort: "Сортировка",
      Filter: "Фильтр",
      Equal: "Равно",
      NotEqual: "Не равно",
      StartsWith: "Начинается с",
      EndsWith: "Заканчивается на",
      Contains: "Содержит",
      DoesNotContains: "Не содержит",
      CustomFilter: "Пользовательский фильтр",
      SelectAll: "Выбрать все",
    },
  },
});
const get = async () => {
  return await api.post("patient/get_all", null, {
    params: {
      limit: 10000,
    },
  });
};

const Statistics = () => {
  const [data, setData] = React.useState([] as Patient[]);
  React.useEffect(() => {
    get().then((res) => {
      setData(res.data.patients);
    });
  }, []);
  return (
    <SpreadsheetComponent
      saveUrl="https://services.syncfusion.com/react/production/api/spreadsheet/save"
      openUrl="https://services.syncfusion.com/react/production/api/spreadsheet/open"
      height={"800px"}
      locale="ru-RU"
    >
      <SheetsDirective>
        <SheetDirective name="Пациенты">
          <RangesDirective>
            <RangeDirective dataSource={data}></RangeDirective>
          </RangesDirective>
        </SheetDirective>
      </SheetsDirective>
    </SpreadsheetComponent>
  );
};

export default Statistics;
