function PayPassword(container_id) {
    var _this = this;
    this.containerId = container_id;
    this.maxLength = 6;
    this.password = [];
    this.onFinishedListener;
    this.moreActionListener;

    this.reset = function(){
        _this.password = [];
        $(".pwd_f").empty();
    };

	this.addNumber = function(num){
        if(_this.password.length == _this.maxLength) return;
        _this.password.push(num);
        _this.updateUI();
        if(_this.password.length == _this.maxLength) _this.fireOnFinishedListeners(_this.password);
    };

    this.backspace = function(){
        if(_this.password.length == 0) return;
        _this.password.pop();
        _this.updateUI();
    }
	
    this.parseSettings = function(GraphSettings){
        _this.maxLength = Number(GraphSettings.MaxLength) || 6;
        _this.moreActionText = GraphSettings.MoreActionText || "Forget password?";
        _this.invalidPwdMsg = GraphSettings.InvalidPasswordMessage || "Invalid password!";
    };

    this.initUI = function(){
        $(".moreAction").text(_this.moreActionText).click(function(e){
            _this.fireMoreActionListeners(e);
        });
        var pwd_field = $(".pwd_field");
        for(var i=0,l=_this.maxLength;i<l;i++){
            var pwd_f = $("<div class='pwd_f'></div>").css("width",(100/_this.maxLength)+"%");
            if(i==0){
                pwd_f.addClass("pwd_f_first");
            }else if(i == l-1){
                pwd_f.addClass("pwd_f_last");
            }else{
                pwd_f.addClass("pwd_f_middle");
            }
            pwd_field.append(pwd_f);
        }
        $(".pwd_d_c_digit").click(function(e){
            $(".err_msg").text("");
            _this.addNumber($(this).text());
        });
        $(".pwd_d_c_back").click(function(e){
            _this.backspace();
        });
    };

    this.addGrayColor = function(e){
        $(this).addClass("pwd_d_c_gray");
    };
    this.removeGrayColor = function(e){
        $(this).removeClass("pwd_d_c_gray");
    };

    this.updateUI = function(){
        $(".pwd_f").each(function(idx){
            $(this).html(idx<_this.password.length ? fillDiv = "<div class='pwd_f_fill'></div>":"");
        });
    };

    this.initConfig = function(GraphSettings){
        this.reset();
        this.parseSettings(GraphSettings);
        this.initUI();
    };
	
    this.fireOnFinishedListeners = function(pwd){
        if(_this.onFinishedListener){
            _this.onFinishedListener(pwd.join(""));
        }
    };
    this.fireMoreActionListeners = function(e){
        if(_this.moreActionListener){
            _this.moreActionListener(e);
        }
    };
    
    this.setValidPassword = function(valid){
    	if(valid){
            $("#"+_this.containerId).hide();
        }else{
            $(".err_msg").text(_this.invalidPwdMsg);
            _this.reset();
            _this.updateUI();
        }
    }
}

PayPassword.prototype.initGraphSettings = function(GraphSettings){
    this.initConfig(GraphSettings);
};

PayPassword.prototype.setMoreActionListener = function(eventHandler){
    this.moreActionListener = eventHandler;
};
PayPassword.prototype.setOnFinishedListener = function(eventHandler){
    this.onFinishedListener = eventHandler;
};
PayPassword.prototype.handleOnFinishedResult = function(valid){
    this.setValidPassword(valid);
};