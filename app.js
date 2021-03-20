//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const $ = require('jquery');

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/ppDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const funSchema = {
  date: Date,
  content: String
};

const diarySchema = {
  date: Date,
  content: String
};

const blogSchema = {
  title: String,
  date: Number,
  content: String
};



const Fun = mongoose.model("Fun", funSchema);
const Diary = mongoose.model("Diary", diarySchema);
const Blog = mongoose.model("Blog", blogSchema);

const defaultItems = [];

const blogerSchema = {
  name: String,
  posts: [blogSchema]
};

const Bloger = mongoose.model("Bloger", blogerSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/diary", function(req, res) {
  const today = new Date();
  let options = {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: 'numeric'
  }
  let day = today.toUTCString();
  Diary.find({}, function(err, posts) {
    res.render("diary", {
      startingContent: homeStartingContent,
      posts: posts,
      currentDay: day
    });
  });
});

app.get("/fun", function(req, res) {
  const today = new Date();
  let options = {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: 'numeric'
  }
  let day = today.toUTCString();
  Fun.find({}, function(err, posts) {
    res.render("fun", {
      startingContent: homeStartingContent,
      posts: posts,
      currentDay: day
    });
  });
});

app.get("/health", function(req, res) {
  Bloger.findOne({
    name: "health"
  }, function(err, foundList) {

    if (!err) {
      if (!foundList) {
        const newBlog = new Bloger({
          name: "health",
          posts: defaultItems
        });
        newBlog.save();
        res.redirect("/health");
      } else {
        res.render("health", {
          newListItems: foundList.posts,
          startingContent: homeStartingContent
        })
      }
    }
  });
});

app.get("/political", function(req, res) {
  Bloger.findOne({
    name: "political"
  }, function(err, foundList) {

    if (!err) {
      if (!foundList) {
        const newBlog = new Bloger({
          name: "political",
          posts: defaultItems
        });
        newBlog.save();
        res.redirect("/political");
      } else {
        res.render("political", {
          newListItems: foundList.posts,
          startingContent: homeStartingContent
        })
      }
    }
  });
});

app.get("/educational", function(req, res) {
  // const customName = req.params.customName;

  Bloger.findOne({
    name: "educational"
  }, function(err, foundList) {

    if (!err) {
      if (!foundList) {
        const newBlog = new Bloger({
          name: "educational",
          posts: defaultItems
        });
        newBlog.save();
        res.redirect("/educational");
      } else {
        res.render("educational", {
          newListItems: foundList.posts,
          startingContent: homeStartingContent
        })
      }
    }
  });
});


//-------------------Compose route---------------

app.get("/funCompose", function(req, res) {
  const today = new Date();
  let options = {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: 'numeric'
  }
  let day = today.toUTCString();
  res.render("funCompose", {
    currentDay: day
  });
});

app.get("/eduCompose", function(req, res) {

  dayFunction(today);
  let day = today.toUTCString();

  res.render("eduCompose", {
    currentDay: day
  });
});

app.get("/polCompose", function(req, res) {

  dayFunction();
  let day = today.toUTCString();
  res.render("polCompose", {
    currentDay: day
  });
});

app.get("/healthCompose", function(req, res) {

  dayFunction();
  let day = today.toUTCString();
  res.render("healthCompose", {
    currentDay: day
  });
});

app.get("/diaryCompose", function(req, res) {
  // const today = new Date();
  // let options = {
  //   weekday: "short",
  //   day: "numeric",
  //   month: "long",
  //   year: 'numeric'
  // }
  dayFunction(today);
  let day = today.toUTCString();
  res.render("diaryCompose", {
    currentDay: day
  });

});
const today = new Date();

function dayFunction() {
  // const today = new Date();
  let options = {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: 'numeric'
  }
  return today;
}

//------------------------Post route---------------

app.post("/funCompose", function(req, res) {

  const diary = new Fun({
    date: req.body.postDate,
    content: req.body.postBody
  });
  diary.save(function(err) {
    if (!err) {
      res.redirect("fun");
    }
  });
});

app.post("/diaryCompose", function(req, res) {

  const diary = new Diary({
    date: req.body.postDate,
    content: req.body.postBody
  });
  diary.save(function(err) {
    if (!err) {
      res.redirect("diary");
    }
  });
});

app.post("/eduCompose", function(req, res) {
  const newPosts = {
    title: req.body.postTitle,
    date: req.body.postDate,
    content: req.body.postBody
  };

  Bloger.findOne({
    name: "educational"
  }, function(err, foundList) {

    if (!err) {
      if (!foundList) {
        const newBlog = new Bloger({
          name: "educational",
          posts: newPosts
        });

        newBlog.save();
      } else {
        foundList.posts.push(newPosts);
        foundList.save();
        res.redirect("educational");
      }
    }

  });
});

app.post("/polCompose", function(req, res) {

  const newPosts = {
    title: req.body.postTitle,
    date: req.body.postDate,
    content: req.body.postBody
  };

  Bloger.findOne({
    name: "political"
  }, function(err, foundList) {

    if (!err) {
      if (!foundList) {
        const newBlog = new Bloger({
          name: "political",
          posts: newPosts
        });

        newBlog.save();
      } else {
        foundList.posts.push(newPosts);
        foundList.save();
        res.redirect("political");
      }
    }

  });
});

app.post("/healthCompose", function(req, res) {

  const newPosts = {
    title: req.body.postTitle,
    date: req.body.postDate,
    content: req.body.postBody
  };

  Bloger.findOne({
    name: "health"
  }, function(err, foundList) {

    if (!err) {
      if (!foundList) {
        const newBlog = new Bloger({
          name: "health",
          posts: newPosts
        });

        newBlog.save();
      } else {
        foundList.posts.push(newPosts);
        foundList.save();
        res.redirect("health");
      }
    }

  });
});


// ---------------Delete route------------------

app.post("/funDelete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  Fun.findByIdAndRemove(checkedItemId, function(err) {
    if (!err) {
      res.redirect("/fun")
    }
  });
});

app.post("/diaryDelete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  Diary.findByIdAndRemove(checkedItemId, function(err) {
    if (!err) {
      res.redirect("/diary")
    }
  });
});

app.post("/eduDelete", function(req, res) {

  const checkedItemId = req.body.checkbox;
  Bloger.findOneAndUpdate({
    name: "educational"
  }, {
    $pull: {
      posts: {
        _id: checkedItemId
      }
    }
  }, function(err, foundList) {
    if (!err) {
      res.redirect("/educational")
    }
  });
});

app.post("/polDelete", function(req, res) {

  const checkedItemId = req.body.checkbox;
  Bloger.findOneAndUpdate({
    name: "political"
  }, {
    $pull: {
      posts: {
        _id: checkedItemId
      }
    }
  }, function(err, foundList) {
    if (!err) {
      res.redirect("/political")
    }
  });
});

app.post("/healthDelete", function(req, res) {

  const checkedItemId = req.body.checkbox;
  Bloger.findOneAndUpdate({
    name: "health"
  }, {
    $pull: {
      posts: {
        _id: checkedItemId
      }
    }
  }, function(err, foundList) {
    if (!err) {
      res.redirect("/health")
    }
  });
});


app.listen(8000, function() {
  console.log("Server started on port 8000");
});
