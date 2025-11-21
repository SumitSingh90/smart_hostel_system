let stu = [11, 12, 11];

let temp = [];

stu.forEach((val) => {
    if (!temp.includes(val))
        temp.push(val)
});

console.log(temp.length);