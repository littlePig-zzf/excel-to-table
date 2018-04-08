
(window => {
	let rABS = false;
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
	fixdata = (data) => {
	    var o = "", l = 0, w = 10240;
	    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
	    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
	    return o;
	},
	handleChange = (files) => {
		if(files.length === 0) return
			console.log('files')
			console.log(files)
		var f = files[0];
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function (e) {
            var data = e.target.result;
            var wb;
            var result;
            if (rABS) {
                wb = XLSX.read(data, { type: 'binary' });
            } else {
                var arr = fixdata(data);
                wb = XLSX.read(btoa(arr), { type: 'base64' });
            }
            result =  XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

            dealData(result);

            document.getElementById("excelBox").innerHTML = JSON.stringify(result);
        };
        if (rABS) reader.readAsBinaryString(f);
        else reader.readAsArrayBuffer(f);

		uploadFiles(files)
	},
	dealData = (data) => {
		console.log(data)
		data.forEach((item)=>{
			
		})
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