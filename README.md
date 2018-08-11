# rg-uploader

첨부파일을 업로드하고, 업로드한 파일들을 관리하고 쉽게 활용하기 위한 목적으로 만들어진 파일 업로더 컴포넌트입니다.  
업로드한 파일을 다양한 방법으로 조작하거나 다른곳에다 활용할 수 있는 가능성이 큰 컴포넌트입니다.



## Demo

다음 링크를 통하여 어떠한 기능을 가지고 있는지 확인할 수 있습니다.

https://redgoose-dev.github.io/rg-uploader/



## Feature

`rg-uploader`는 다음과 같은 기능을 가지고 있습니다.

### file management

업로드한 파일을 관리할 수 있으며, 이미지 파일은 어떤 이미지인지 확인 가능합니다. 그리고 파일들을 컨트롤할 수 있는 다양한 방법들을 제공하고 원하는 기능을 개발할 수 있습니다.

### queue system

파일이 업로드되면 목록에 올라가며 어떤 파일이 올라가 있는지 확인할 수 있습니다. 그리고 그 파일들을 선택하여 컨트롤하거나 외부 컴포넌트에 활용할 수 있습니다.

### queue style

파일목록이 단순히 파일이름 목록만으로 표시되는것을 원하지 않을수도 있습니다. 사진을 주로 올린다면 목록에서 사진을 바로 볼 수 있는 형태로 표시되기를 원할수도 있습니다.  
css로 다양한 스타일을 만들거나 수정하고, 선택할 수 있습니다.

### plugins

상황에 따라서 활용하는 기능이 다르며 모든 기능을 기본기능으로 다 집어넣을 수 없기 때문에 플러그인을 통하여 자유롭게 기능을 골라쓰거나 만들 수 있습니다.
업로더에서 가장 멋진 요소라고 할 수 있습니다.



## Installation and using

다음과 같이 모듈을 설치할 수 있습니다.

```
npm install --save rg-uploader
```
or
```
yarn add rg-uploader
```

```
import rgUploader from 'rg-uploader';
import 'rg-uploader/resource/icons/material-icons.css';
import 'rg-uploader/resource/style.css';

const rgUploader = new RG_Uploader(document.getElementById('id'), {});
```



## Documentation

업로더가 많은 상황을 고려하고 만들어서 소스의 덩치가 자연스럽게 커지게 되었습니다.  
사용법이나 활용에 위키 다음 링크의 위키 문서를 참조해주세요.

https://github.com/redgoose-dev/rg-uploader/wiki



## Thankful vendors

`rg-uploader`는 다음과 같은 라이브러리를 사용하고 있으며 좋은 라이브러리 제공에 감사를 표합니다.

* jQuery - http://jquery.com
* Croppie - https://foliotek.github.io/Croppie/
* Sortable - https://github.com/RubaXa/Sortable
* unsplash(sample image) - https://unsplash.com
* Material design icons - https://design.google.com/icons/



## Browser Compatibility

다름과 같은 브라우저 버전에서 원활한 작동이 가능합니다. 좀더 낮은 버전에서도 작동할 수 있습니다.

* ie11+
* edge 25+
* safari 9+
* chrome 52+
