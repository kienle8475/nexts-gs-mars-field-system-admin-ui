export const antdTableSorter = (a: any, b: any, key: string) => {
  if (typeof a[key] === "number" && typeof b[key] === "number") {
    return a[key] - b[key];
  }

  if (typeof a[key] === "string" && typeof b[key] === "string") {
    a = a[key].toLowerCase();
    b = b[key].toLowerCase();
    return a > b ? -1 : b > a ? 1 : 0;
  }
  return;
};

export const filterArray = (list: any[], key: string, value: any) => {
  let data = list;
  if (list) {
    data = list.filter((item: any) => {
      const itemValue = item[key];
      if (Array.isArray(itemValue)) {
        return itemValue.includes(value);
      }
      return itemValue === value;
    });
  }
  return data;
};

export const wildCardSearch = (list: any[], input: string): any[] => {
  const searchText = (item: any): any => {
    let hasMatch = false;
    let filteredItem = { ...item };

    for (let key in item) {
      if (item[key] == null) {
        continue;
      }

      if (Array.isArray(item[key])) {
        const filteredArray = item[key].map((subItem) => searchText(subItem)).filter(Boolean);

        if (filteredArray.length > 0) {
          filteredItem[key] = filteredArray;
          hasMatch = true;
        } else {
          delete filteredItem[key];
        }
      } else if (typeof item[key] === "object") {
        const nestedMatch = searchText(item[key]);

        if (nestedMatch) {
          filteredItem[key] = nestedMatch;
          hasMatch = true;
        } else {
          delete filteredItem[key];
        }
      } else if (
        item[key].toString().toUpperCase().indexOf(input.toString().toUpperCase()) !== -1
      ) {
        hasMatch = true;
      }
    }

    return hasMatch ? filteredItem : null;
  };

  return list.map((value) => searchText(value)).filter(Boolean);
};

export const wildCardSearchV2 = (list: any[], input: string): any[] => {
  const searchText = (item: any, level: number): any => {
    let hasMatch = false;
    let filteredItem = { ...item };

    for (let key in item) {
      if (item[key] == null) continue;

      if (Array.isArray(item[key])) {
        const filteredArray = item[key]
          .map((subItem) =>
            typeof subItem === "object" && subItem !== null
              ? searchText(subItem, level + 1)
              : subItem.toString().toUpperCase().includes(input.toUpperCase())
                ? subItem
                : null,
          )
          .filter(Boolean);

        if (filteredArray.length > 0) {
          filteredItem[key] = filteredArray;
          hasMatch = true;
        } else {
          delete filteredItem[key];
        }
      } else if (typeof item[key] === "object") {
        const nestedMatch = searchText(item[key], level + 1);

        if (nestedMatch) {
          filteredItem[key] = nestedMatch;
          hasMatch = true;
        } else {
          delete filteredItem[key];
        }
      } else if (item[key].toString().toUpperCase().includes(input.toUpperCase())) {
        hasMatch = true;
      }
    }

    if (hasMatch && level === 0) {
      return item;
    }

    return hasMatch ? filteredItem : null;
  };

  return list.map((value) => searchText(value, 0)).filter(Boolean);
};
