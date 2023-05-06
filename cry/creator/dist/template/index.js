"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var combination = function (name) {
    var interfaceName = "I" + name;
    return "\nimport React from 'react';\nimport './index.less';\nimport { Card } from 'antd';\n\ninterface " + interfaceName + " {}\n\nconst " + name + ": React.FC<" + interfaceName + "> = () => {\n  return (\n    <div className=\"main-content\">\n      <Card bordered={false} className=\"index-card\">\n        \u65B0\u9875\u9762\n      </Card>\n    </div>\n  );\n};\n\nexport default " + name + ";\n  ";
};
exports.default = combination;
