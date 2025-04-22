export const handlebarsHelpers = {
  // options is passed by handlebars
  ifEquals: (a: any, b: any, options: any) => {
    if (a === b) {
      return options.fn(this); // render block
    } else {
      return options.inverse(this); // render else block
    }
  },

  // return string or html
  makeBold: (text: string) => {
    return `<strong>${text}</strong>`;
  },

  // return boolean
  isAdmin: (role: string) => role === "admin",

  // json string
  json: (context: any) => {
    return JSON.stringify(context);
  },
};
