
(window => {
	let inputBox = $('.inputBox');  //上传文件的盒子
	let fileListBox = '';  //上传文件的盒子
	let url;  //ajax交互的接口
	let token;  //token
	let action;
	let fileName = [];  //上传图片的文件名--显示列表
	let uploadData = {
		getError: (action, option, xhr)=>{
			const msg = `fail to post ${action} ${xhr.status}'`;
		    const err = new Error(msg);
		    err.status = xhr.status;
		    err.method = 'post';
		    err.url = action;
		    return err;
		},
		getBody: () => {
			const text = xhr.responseText || xhr.response;
		    if (!text) {
		        return text;
		    }

		    try {
		        return JSON.parse(text);
		    } catch (e) {
		        return text;
		    }
		},
		ajax: () => {
			if (typeof XMLHttpRequest === 'undefined') {
			        return;
			    }

			    const xhr = new XMLHttpRequest();
			    const action = option.action;

			    if (xhr.upload) {
			        xhr.upload.onprogress = function progress(e) {
			            if (e.total > 0) {
			                e.percent = e.loaded / e.total * 100;
			            }
			            option.onProgress(e);
			        };
			    }

			    const formData = new FormData();

			    if (option.data) {
			        Object.keys(option.data).map(key => {
			            formData.append(key, option.data[key]);
			        });
			    }

			    formData.append(option.filename, option.file);

			    xhr.onerror = function error(e) {
			        option.onError(e);
			    };

			    xhr.onload = function onload() {
			        if (xhr.status < 200 || xhr.status >= 300) {
			            return option.onError(getError(action, option, xhr), getBody(xhr));
			        }

			        option.onSuccess(getBody(xhr));
			    };

			    xhr.open('post', action, true);

			    if (option.withCredentials && 'withCredentials' in xhr) {
			        xhr.withCredentials = true;
			    }

			    const headers = option.headers || {};

			    // if (headers['X-Requested-With'] !== null) {
			    //   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			    // }

			    for (let item in headers) {
			        if (headers.hasOwnProperty(item) && headers[item] !== null) {
			            xhr.setRequestHeader(item, headers[item]);
			        }
			    }
			    xhr.send(formData);
			},
	};
	init = (fileList, url, token, action) => {
		fileListBox = $(fileList);
		url = url;
		token = token;
		action = action;
	},
	bandClick = () => {  //初始化给元素绑定单击事件
		inputBox.click((e)=>{
			e.stopPropagation();  //防止冒泡
		})
	},
	handleClick = () => {  //处理鼠标单击事件
		
		inputBox.click();  //调用input上传文件
	},
	handleChange = (files) => {

		if(files.length === 0) return
		uploadFiles(files)
	},
	uploadFiles = (files) => {
        let postFiles = Array.prototype.slice.call(files);

        postFiles.forEach(file => {
            this.upload(file);
        });
    },
    upload = (file) => {
    	let formData = new FormData();
        formData.append(file.name, file);
        console.log(file.name)

        fileName = file.name;
        let innerCont = '<li>'+ fileName + '</li>';
        fileListBox.append(innerCont)
        // uploadData.ajax({
        //     headers: this.headers,
        //     // withCredentials: this.withCredentials,
        //     file: file,
        //     data: this.data,
        //     filename: this.name,
        //     action: this.action,
        //     onProgress: e => {
        //         this.handleProgress(e, file);
        //     },
        //     onSuccess: res => {
        //         this.handleSuccess(res, file);
        //     },
        //     onError: (err, response) => {
        //         this.handleError(err, response, file);
        //     }
        // });
    }
})()