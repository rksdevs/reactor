//const root = createRoot("document.getElementById("root");
//root.render(<App />)

// let vDom = {
//     type: "div",
//     props: {id: "root"},
//     children: []
// }

let vDom = {
  type: "",
  props: {},
  children: [],
};

let app = {
  type: "div",
  props: { id: "app" },
  children: [],
};

let newHeading = {
  type: "h1",
  props: { class: "heading-main" },
  children: "New Heading",
};

//function to check empty objects
function emptyObject (obj) {
    // console.log(obj)
    // return Object.keys(obj).length === 0
    for (const prop in obj) {
        if(Object.hasOwn(obj, prop)) {
            return false
        }
    }
}

//create elements
function createElem({ type, props, children }) {
  return {
    type,
    props,
    children: Array.isArray(children)
      ? children
      : [{ type: "text", props: {}, children: children }],
  };
}

//function to load each element to a parent element
function loadElement(parentElement, elem) {
//   console.log(parentElement);
  // if(Array.isArray(parentElement.children)) {
  //     console.log("child is an array");
  //     parentElement.children.push(elem)
  // } else {
  //     console.log("child is NOT an array");
  //     parentElement.children = [elem]
  // }
  parentElement.children.push(elem);
}

//function to convert virtual DOM nodes to real DOM Node
function mount(nodeToMount) {
    console.log(nodeToMount, 59)
  //this probably should be a recurssive function, which starts to create real DOM Nodes till we reach the root node
  // let rootNode = document.getElementById("root");
  let currentNode;
//   let baseNode;

  //base case for recursive function
  if (nodeToMount.type === "div" && nodeToMount.props.id === "root") {
    // if we are at the root node, we simply the create root node, append whatever is there in current node and return it
    let root = document.createElement("div");
    root.setAttribute("id", "root");
    root.append(currentNode);
    return root;
  }

  // if case scenario let basicVDom = {
  // type: "h1",
  // props: {class: "heading-one", id: "main-heading"},
  // children: [{type: "text"}, props: {}, children: "I'm the main heading"]
  // }
  //setting up the content
  if (nodeToMount.children.length == 1 && nodeToMount.children[0].type === "text") {
    //this is a text node
    //create a real DOM Node
    let domType = nodeToMount.type;
    // console.log(emptyObject(nodeToMount.props))
    let domAttributes = emptyObject(nodeToMount.props) ? [] : Object.entries(nodeToMount.props); // [["id", "main-heading"], ["class", "heading-one"]]
    let domContent = nodeToMount.children;
    console.log(domType, domAttributes, domContent);

    currentNode = document.createElement(domType);
    //setting up the attributes
    if(domAttributes.length) {
        domAttributes.forEach((e) => currentNode.setAttribute(e[0], e[1]));
    }
    let textNode = document.createTextNode(domContent[0].children);
    currentNode.append(textNode);
  } else {
    // else case scenario let example = {
    //   type: "div", 
    //   props: { class: "sample-div" },
    //   children: [
    //     {
    //       type: "h1",
    //       props: {},
    //       children: [{
    //       type: "text",
    //       props: {},
    //       children: "heading text from h1",
    //     }],
    //     },
    //     {
    //       type: "p",
    //       props: {},
    //       children: [{
    //       type: "text",
    //       props: {},
    //       children: "paragraph text from p",
    //     }],
    //     },
    //   ],
    // };
    // let newNode = document.createElement()
    nodeToMount.children.forEach(childElement => mount(childElement))
  }
    console.log(currentNode);
  document.getElementById("root").append(currentNode);
}

function createRoot(htmlNode) {
  // <div id="root"></div>

  let allAttributesObj = htmlNode
    .getAttributeNames()
    .reduce(
      (obj, name) => ({ ...obj, [name]: htmlNode.getAttribute(name) }),
      {}
    );

  console.log(allAttributesObj);

  vDom.type = htmlNode.nodeName.toLowerCase();
  vDom.props = allAttributesObj;
  vDom.children = [];

  return {
    // vDom,
    render: function (elementToMount) {
      vDom.children.push(elementToMount);
    },
  };
}

// let root = createRoot(document.getElementById("root"));
// root.render(app);
loadElement(
  app,
  createElem({
    type: "div",
    props: { id: "sub-heading" },
    children: "I'm a sub-heading",
  })
);
loadElement(
  app,
  createElem({
    type: "div",
    props: { id: "content-section" },
    children: [
      createElem({
        type: "h3",
        props: { id: "new-heading" },
        children: "I'm a new heading",
      }),
    ],
  })
);
// console.log(vDom);

// <App />
// <App>
// <Heading-Main />
// </App>

let headingDesc = {
  type: "p",
  props: {
    children: "This is a description element for the heading",
  },
};

function renderChange(elementToMount, parentELement) {
  let root = document.getElementById("root");
  let elementType = elementToMount.type;
  let newElement = document.createElement(elementType);
  // newElement.classList.add("new-heading")
  let contentsToAdd = document.createTextNode(elementToMount.props.children);
  newElement.append(contentsToAdd);

  //handling when to overwrite and when to append
  if (parentELement === root) {
    if (!root.hasChildNodes()) {
      //scenario one -- First Render - if the parentElement is root, root has no childElements
      console.log("first render root");
      //clear root
      root.replaceChildren();
      root.append(newElement);
    } else {
      //not a first render, that means we need to re-rendering root with new elements
      console.log("re-render root");
      root.replaceChildren(newElement);
    }
    // parentELement.append(newElement);
  } else {
    //scenario two -- if the parentElement is a non-root element
    if (!parentELement) {
      console.log("parent element doesnt exists");
      //if parent element doesnt exist create new element
      // let newParentElement = document.createElement("div") //by default creates a div element
      // newParentElement.append(newElement);
      throw new Error(
        "Can not add this element, as parent element is not found!"
      );
    } else {
      // console.log(parentELement.hasChildNodes())
      // console.log(parentELement)
      //if parent element exists
      if (
        [...parentELement.childNodes].filter((node) => node.nodeType !== 3)
          .length === 0
      ) {
        console.log("has parent but no child nodes");
        //parent element exists but has no children
        parentELement.append(newElement);
      } else {
        console.log("has parent also has child nodes");
        //parent element exists and has child nodes
        // here I need to decide where to mount the new element -- this I will do next
        parentELement.append(newElement);
      }
    }
  }
}

let basicVDom = {
  type: "h1",
  props: { class: "heading-one", id: "main-heading" },
  children: [
    { type: "text", props: {}, children: "I'm a the heading from basic VDom" },
  ],
};

let example = {
      type: "div", 
      props: { class: "sample-div" },
      children: [
        {
          type: "h1",
          props: {},
          children: [{
          type: "text",
          props: {},
          children: "heading text from h1",
        }],
        },
        {
          type: "p",
          props: {},
          children: [{
          type: "text",
          props: {},
          children: "paragraph text from p",
        }],
        },
      ],
    };

mount(example);
// render(newHeading, document.getElementById("root"));
// render(headingDesc, document.querySelector("h1"));
// let root = createRoot(document.getElementById("root"));
// root.render(newHeading)
