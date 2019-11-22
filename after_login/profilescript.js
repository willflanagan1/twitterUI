
const buildTweets = function (data) {
    data.forEach(tweet => {
        if (tweet.isMine) {
        var tweetID = tweet.id;
        let thisTweetContainer = $("<div tweetID=" + tweetID + " isLiked= " + tweet.isLiked + ">")
        thisTweetContainer.addClass('aTweet');
            if (tweet.type == 'retweet') {
                try {
                    if (tweet.body == tweet.parent.body) {
                        thisTweetContainer.attr('type', 'retweet')
                        thisTweetContainer.append("<p class=author style='font-size: 15px'></span><strong style='color: rgb(32, 156, 238)'>" + tweet.author + "</strong><span style='color: rgb(0, 0, 0); font-size: 13px'> retweeted</p>")
                        thisTweetContainer.append("<p class=tweet-body></p>")
                        let parentContainer = $("<div class=parent-container>");
                        parentContainer.append("<p tweetID=" + tweet.parent.id + " class=author style='font-size: 20px'><strong style='color: rgb(32, 156, 238)'>" + tweet.parent.author + "</strong></p>")
                        parentContainer.append("<p class=tweet-body>" + tweet.parent.body + "</p>")
                        thisTweetContainer.append(parentContainer);
                    } else {
                        thisTweetContainer.attr('type', 'quote-tweet')
                        thisTweetContainer.append("<p class=author style='font-size: 20px'> <strong style='color: rgb(32, 156, 238)'>" + tweet.author + "</strong><span style='color: rgb(0, 0, 0); font-size: 15px'> quote tweeted</span></p>")
                        thisTweetContainer.append("<p class=tweet-body>" + tweet.body + "</p>")
                        let parentContainer = $("<div class=parent-container>");
                        parentContainer.append("<p tweetID=" + tweet.parent.id + " class=author style='font-size: 20px'><strong style='color: rgb(32, 156, 238)'>" + tweet.parent.author + "</strong></p>")
                        parentContainer.append("<p class=tweet-body>" + tweet.parent.body + "</p>")
                        thisTweetContainer.append(parentContainer);
                    }
                } catch {
                    thisTweetContainer.append("<p class=author style='font-size: 20px'><strong style='color: rgb(32, 156, 238)'>" + tweet.author + "</strong></p>")
                    thisTweetContainer.append("<p class=tweet-body>" + tweet.body + "</p>")
                }
            } else {
                thisTweetContainer.append("<p class=author style='font-size: 20px'><strong style='color: rgb(32, 156, 238)'>" + tweet.author + "</strong></p>")
                thisTweetContainer.append("<p class=tweet-body>" + tweet.body + "</p>")
            }
        let buttons = renderButtons(tweet);
        thisTweetContainer.append(buttons);
        $("#tweets-container").append(thisTweetContainer);
        }
    });

    $('.like-button').click(handleLikeButtonPress);
    $('.reply-button').click(renderReplyForm);
    $('.rt-button').click(renderRetweetForm);
    $('.edit-button').click(renderEditForm);
    $('.delete-button').click(handleDeleteButtonPress);
};
const renderButtons = function (aTweet) {
    var tweet = aTweet;
    let buttonContainer = $('<div class="button-container">');

    let likeButton =
        $(`<button class="button is-small is-rounded like-button">
              <span class="icon">
                   <i class="fas fa-heart"></i>
                   <span class="icon-number">${tweet.likeCount}</span>
              </span>
         </button>`);
    if (tweet.isLiked == true) {
        likeButton.css('color', 'red');
    }

    let retweetButton =
        $(`<button class="button is-small is-rounded rt-button">
              <span class="icon">
                   <i class="fas fa-retweet"></i>
                   <span class="icon-number">${tweet.retweetCount}</span>
              </span>
         </button>`);

    let replyButton =
        $(`<button class="button is-small is-rounded reply-button">
              <span class="icon">
                   <i class="far fa-comment"></i>
                   <span class="icon-number">${tweet.replyCount}</span>
              </span>
             </button>`);

    let deleteButton =
        $(`<button class="button is-small is-rounded delete-button">
              <span class="icon">
                   <i class="fa fa-trash"></i>
                   <span class="icon-text">Delete</span>
              </span>
            </button>`);

    let editButton =
        $(`<button class="button is-small is-rounded edit-button">
              <span class="icon">
                   <i class="far fa-edit"></i>
                   <span class="icon-text">Edit Tweet</span>
              </span>
             </button>`);
    buttonContainer.append(replyButton);
    buttonContainer.append(likeButton);
    buttonContainer.append(retweetButton);
    if (tweet.isMine) {
        buttonContainer.append(deleteButton);
        buttonContainer.append(editButton);
    }
    return buttonContainer;
};

const renderEditForm = function () {
    var tweet = $(this).parent().parent();
    var tweetInfo = $(this).parent().parent().children();
    var tweetBody;
    if (tweet.attr('type') == 'quote-tweet') {
        tweetBody = tweetInfo[1];
    } else if (tweet.attr('type') == 'retweet') {
        alert("You cannot edit a retweet!");
    } else {
        tweetBody = tweetInfo[1];
    }

    var saveBody = tweetBody.innerHTML;
    tweetBody.innerHTML =
        `<div class="field" id="edit-form">
              <div class="control">
                   <textarea id="edit-body" class="textarea is-info">${tweetBody.innerHTML}</textarea>
              </div>
         </div>
         <div class="field is-grouped" id="edit-buttons">
           <div class="control">
               <button id="save-button" type="submit" class="button is-info">Save</button>
           </div>
           <div class="control" id="cancel-button">
               <button class="button is-light">Cancel</button>
           </div>
         </div>`
    $("#save-button").click(handleEditSaveButtonPress);
    $("#cancel-button").click(function () {
        tweetBody.innerHTML = saveBody;
    });
};

const renderReplyForm = function () {
    let btn = $(this);
    let originalTweet = btn.parent().parent();
    let replyContainer = $("<div id=reply-container>Reply to Tweet</div>");
    let replyForm =
        $(`<div class="field" id="reply-form">
              <div class="control">
                   <textarea id="reply-body" class="textarea is-info" placeholder="Type Reply Here"></textarea>
              </div>
         </div>
         <div class="field is-grouped" id="reply-form-buttons">
           <div class="control">
               <button id="reply-button" type="submit" class="button is-info">Reply</button>
           </div>
           <div class="control">
               <button id="cancel-reply-button" class="button is-light">Cancel</button>
           </div>
         </div>`);
    replyContainer.append(replyForm);
    originalTweet.append(replyContainer);
    $('#reply-button').click(handleReplySaveButtonPress);
    $('#cancel-reply-button').click(function () {
        console.log("hit");
        $("#reply-container").remove();
    });
}

const handlePostButtonPress = function () {
    let postBody = document.getElementById('new-tweet').value;
    $.ajax({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        xhrFields: {
            withCredentials: true,
        },
        data: {
            body: postBody
        },
    }).then(function () {
        location.reload();
    }).catch(function () {
        alert("Failed to post tweet!")
    });
};

const handleClearButtonPress = function () {
    $('#new-tweet').val('');
};

const handleLikeButtonPress = function () {
    var btn = $(this);
    var id = btn.parent().parent().attr('tweetID');
    var isLiked = btn.parent().parent().attr('isLiked');
    var children = btn.children();
    var grandChildren = children.children();
    var likeCount = grandChildren[1].innerHTML;
    if (isLiked == 'true') {
        unlikeTweet(id, btn);
    } else {
        $.ajax({
            method: 'put',
            url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id + '/like',
            xhrFields: {
                withCredentials: true,
            },
        }).then(function () {
            btn.parent().parent().attr('isLiked', 'true');
            btn.css('color', 'red');
            likeCount++;
            grandChildren[1].innerHTML = likeCount;
        }).catch(function () {
            alert("Failed to like tweet!")
        });
    };
};

const unlikeTweet = function (tweetID, button) {
    var children = button.children();
    var grandChildren = children.children();
    var likeCount = grandChildren[1].innerHTML;
    var isLiked = button.parent().parent().attr('isLiked');
    if (isLiked == 'false') {
        handleLikeButtonPress();
    } else {
        $.ajax({
            method: 'put',
            url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + tweetID + '/unlike',
            xhrFields: {
                withCredentials: true,
            },
        }).then(function () {
            button.parent().parent().attr('isLiked', 'false');
            likeCount--;
            grandChildren[1].innerHTML = likeCount;
            button.css('color', '#363636');
            button.hover(function () {
                $(this).css('color', 'rgba(255, 0, 0, 0.527)');
            }, function () {
                $(this).css('color', '#363636');
            });
        });
    }
}

const handleDeleteButtonPress = function () {
    var tweet = $(this).parent().parent();
    var id = $(this).parent().parent().attr('tweetID');
    $.ajax({
        method: 'delete',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id,
        xhrFields: {
            withCredentials: true,
        },
    }).then(function () {
        tweet.remove();
    }).catch(function () {
        alert("Failed to delete tweet!")
    });
};

const handleEditSaveButtonPress = function () {
    var id = $(this).parent().parent().parent().parent().attr('tweetID');
    let updatededBody = document.getElementById('edit-body').value;

    var jqObj = $(this).parent().parent().parent();
    var tweetBody = jqObj[0];
    tweetBody.innerHTML = updatededBody;
    $.ajax({
        method: 'put',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id,
        xhrFields: {
            withCredentials: true,
        },
        data: {
            body: updatededBody
        },
    });
};

const handleReplySaveButtonPress = function () {
    let $btn = $(this);
    var originalTweet = $btn.parent().parent().parent().parent();
    var id = originalTweet.attr('tweetid');
    let replyBody = document.getElementById('reply-body').value;
    $.ajax({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        xhrFields: {
            withCredentials: true,
        },
        data: {
            type: "reply",
            parent: id,
            body: replyBody
        },
    }).then(function () {
        location.reload();
    });
}

const handleRetweetButtonPress = function () {
    let $btn = $(this);
    var jqObj = $btn.parent().parent().parent().parent();
    var tweet = jqObj[0];
    var tweetBody;
    if (tweet.getAttribute('type') == 'quote-tweet') {
        tweetBody = tweet.children[1].textContent;
    } else if (tweet.getAttribute('type') == 'retweet') {
        alert("You cannot retweet a retweet!");
        exit();
    } else {
        tweetBody = tweet.children[1].textContent;
    }
    var id = jqObj.attr('tweetID');
    let replyBody = document.getElementById('reply-body').value;
    if (replyBody == "") {
        $.ajax({
            method: 'post',
            url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
            xhrFields: {
                withCredentials: true,
            },
            data: {
                type: "retweet",
                parent: id,
                body: tweetBody,
            },
        }).then(function () {
            location.reload();
        });
    } else {
        $.ajax({
            method: 'post',
            url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
            xhrFields: {
                withCredentials: true,
            },
            data: {
                type: "retweet",
                parent: id,
                body: replyBody,
            },
        }).then(function () {
            location.reload();
        });
    }
}

const renderRetweetForm = function () {
    let btn = $(this);
    let originalTweet = btn.parent().parent();
    let replyContainer = $("<div id=reply-container>Retweet</div>");
    let replyForm =
        $(`<div class="field" id="reply-form">
              <div class="control">
                   <textarea id="reply-body" class="textarea is-info" placeholder="Optional: quote tweet"></textarea>
              </div>
         </div>
         <div class="field is-grouped" id="reply-form-buttons">
           <div class="control">
               <button id="reply-button" type="submit" class="button is-info">Retweet</button>
           </div>
           <div class="control">
               <button id="cancel-reply-button" class="button is-light">Cancel</button>
           </div>
         </div>`);
    replyContainer.append(replyForm);
    originalTweet.append(replyContainer);
    $('#reply-button').click(handleRetweetButtonPress);
    $('#cancel-reply-button').click(function () {
        console.log("hit");
        $("#reply-container").remove();
    });
}


const getTweets = function () {
    $.ajax({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        xhrFields: {
            withCredentials: true,
        },
    }).then(function (data) {
        buildTweets((data));
    }).catch(function () {
        alert("Failed to load tweets!")
    });
};


$(function () {
    getTweets();
})