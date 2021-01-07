
const arrayToTree = (input: any[] = []) => {
  const inputMap = input.reduce((s, v) => {
    s[v.menuId] = { ...v, children: [] };
    return s;
  }, {});
  const output = [];
  let i = 0;
  while (i < input.length) {
    if (Number(input[i].parentId) === 0) {
      const { menuId } = input[i];
      output.push(inputMap[menuId]);
    } else {
      const { parentId, menuId } = input[i];
      if (inputMap[parentId] && inputMap[parentId].children) {
        inputMap[parentId].children.push(inputMap[menuId]);
      }

    }
    i++;
  }
  return output;
};

export default arrayToTree;