//function to check empty objects
function emptyObject(obj) {
  // console.log(obj)
  // return Object.keys(obj).length === 0
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
}

//create elements for VDOM
function createElem({ type, props, children }, parentElem) {
  // return ;
  parentElem.children.push({
    type,
    props,
    children: Array.isArray(children)
      ? children
      : [{ type: "text", props: {}, children: children }],
  });
}

function createRoot(htmlNode) {
  let vDom = {
    type: htmlNode.nodeName.toLowerCase(),
    props: htmlNode
      .getAttributeNames()
      .reduce(
        (obj, name) => ({ ...obj, [name]: htmlNode.getAttribute(name) }),
        {}
      ),
    children: [],
  };

  return {
    render: function (elementToMount) {
      vDom.children = [elementToMount]; // Overwrite previous render
      htmlNode.innerHtml = ""; //clear previous content
      vDom.children.forEach((child) => htmlNode.appendChild(mount(child))); // Convert & mount VDOM to real DOM
    },
  };
}

//function to convert virtual DOM node to real DOM Node //function to mount all the nodes
function mount(nodeToConvert) {
  //handle text nodes
  if (nodeToConvert.type === "text") {
    return document.createTextNode(nodeToConvert.children);
  }

  //create real dom node
  let realDOM = document.createElement(nodeToConvert.type);
  //add attributes
  Object.entries(nodeToConvert.props || {}).forEach(([key, val]) =>
    realDOM.setAttribute(key, val)
  );
  //recursively call mount on children
  nodeToConvert.children.forEach((child) => realDOM.appendChild(mount(child)));

  return realDOM;
}

let example = {
  type: "div",
  props: { class: "sample-div" },
  children: [
    {
      type: "h1",
      props: { class: "heading" },
      children: [
        {
          type: "text",
          props: {},
          children: "heading text from h1",
        },
      ],
    },
    {
      type: "p",
      props: {},
      children: [
        {
          type: "text",
          props: {},
          children: "paragraph text from p",
        },
      ],
    },
  ],
};
let root = createRoot(document.getElementById("root"));
root.render(example);
