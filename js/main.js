(function() {
    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);
    var canvas = document.getElementById('imageCanvas');
    var ctx = canvas.getContext('2d');


    function handleImage(e) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
        $("#blurFaces").fadeIn(2000);
    }

    $('#blurFaces').click(function() {
        var $this = $(this);
        var image = new Image();
        image.id = 'uploadedImage';
        image.src = $('#imageCanvas')[0].toDataURL();
        document.getElementById('imageContent').appendChild(image);
        var coords = $('#uploadedImage').faceDetection({
            complete: function() {
                console.log('The faces have been detected');
            },
            error: function(img, code, message) {
                $this.text('error!');
                alert('Error: ' + message);
            }
        });

        for (var i = 0; i < coords.length; i++) {
            boxBlurCanvasRGBA('imageCanvas', coords[i].x, coords[i].y, coords[i].width, coords[i].height, 30, 1);
            $('<div>', {
                'class': 'face',
                'css': {
                    'position': 'absolute',
                    'left': coords[i].positionX + 'px',
                    'top': coords[i].positionY + 'px',
                    'width': coords[i].width + 'px',
                    'height': coords[i].height + 'px'
                }
            }).appendTo('#content');
        }

        $('#content').fadeOut(2000, function() {
            $('#content').html('');
            var dataURL = $('#imageCanvas')[0].toDataURL();
            document.getElementById('uploadedImage').src = dataURL;
            $('#save').html("<a href='" + dataURL + "' download='blurryFaces.png' class='btn btn-default'><span class='glyphicon glyphicon-download-alt'></span> Save Image to Desktop</a>");
            $('#save').fadeIn(2000);
            $('#imgur').fadeIn(2000);

            $('#imgur').click(function() {

                var img;
                try {
                    img = document.getElementById('imageCanvas').toDataURL('image/jpeg', 0.9).split(',')[1];
                }
                catch (e) {
                    img = document.getElementById('imageCanvas').toDataURL().split(',')[1];
                }
                $.ajax({
                    url: 'https://api.imgur.com/3/image',
                    method: 'POST',
                    headers: {
                        'Authorization': 'Client-ID b5924ef75ccbba7'
                    },
                    data: {
                        'image': img,
                        'type': 'base64'
                    },
                    success: function(result) {

                        console.log('cool');
                        console.log(result);
                    }
                });
            });


        });



    });
})();