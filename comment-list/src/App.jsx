import './App.css';
import {useState, useRef, useEffect} from 'react'
import _ from 'lodash'
import classNames from 'classnames'
import {v4 as uuidV4} from 'uuid'
import dayjs from 'dayjs'
import axios from 'axios'

// 当前登录用户信息
const user = {
  uid: '30009257',
  avatar: '',
  uname: 'wz'
}

// 导航 Tab 数组
const tabs = [
  {type: 'hot', text: '最热'},
  {type: 'time', text: '最新'}
]

//封装请求数据的Hook
function useGetList(){
	// 获取接口数据渲染
	const [commentList, setCommentList] = useState([])
	useEffect(()=>{
		  // 请求数据
		  async function getList() {
			try {
			  const response = await axios.get('http://localhost:3001/list')
			  setCommentList(response.data)
			} catch (error) {
			  console.error('Error fetching list:', error)
			}
		  }
		  getList()
	},[])
	
	return {
		commentList,
		setCommentList
	}
}

// 封装Item组件
function Item( {item, onDel} ) {
	return(
		<div className="reply-item">
		  {/* 头像 */}
		  <div className="root-reply-avatar">
			<div className="bili-avatar">
			  <img
				className="bili-avatar-img"
				alt=""
				src={item.user.avatar}
			  />
			</div>
		  </div>
		
		  <div className="content-wrap">
			{/* 用户名 */}
			<div className="user-info">
			  <div className="user-name">{item.user.uname}</div>
			</div>
			{/* 评论内容 */}
			<div className="root-reply">
			  <span className="reply-content">{item.content}</span>
			  <div className="reply-info">
				{/* 评论时间 */}
				<span className="reply-time">{item.ctime}</span>
				{/* 评论数量 */}
				<span className="reply-time">点赞数:{item.like}</span>
				{user.uid === item.user.uid &&
				<span className='delete-btn' onClick={()=>onDel(item.rpid)}>
				  删除
				</span>}
			  </div>
			</div>
		  </div>
		</div>
	)
}

function App() {
  // 渲染评论列表
  // 1. 使用 useState 维护 list
  // const [commentList, setCommentList] = useState(_.orderBy(comment_list, 'like', 'desc'))
  const{commentList,setCommentList} = useGetList()
  
  //删除功能
  const handleDel = (id) =>{
  	setCommentList(commentList.filter(item => item.rpid !== id))
  }
  
  //tab切换
  //1 点击谁就把谁的type记录下来
  //2 通过记录type和每一项便离世的type做匹配 控制激活类名显示
  const[type, setType] = useState('hot')
  const handleTabChange = (type)=>{
	setType(type)
	// 基于列表的排序
	// 点击tab之后，根据tab特性排序返回列表
	if(type==='hot'){
		//根据点赞排序
		// lodash
		setCommentList(_.orderBy(commentList, 'like','desc'))
	} else{
		// 根据创作时间排序
		setCommentList(_.orderBy(commentList, 'ctime', 'desc'))
		
	}
  }
  
  // 发表评论
  const [content, setContent] = useState('')
  const inputRef = useRef(null)
  const handlePublish = ()=>{
	  setCommentList(commentList =>[
		  ...commentList,
		  {
			  "rpid": uuidV4(),
			  "user": {
			    "uid": "30009257",
			    "avatar": "http://toutiao.itheima.net/resources/images/98.jpg",
			    "uname": "黑马前端"
			  },
			  "content": content,
			  "ctime": dayjs(new Date()).format('MM-DD hh:mm'),
			  "like": 69
		  }
	  ])
	  // 清空输入框内容，把input框的value设置为空
	  setContent('')
	  // 重新聚焦，拿到dom元素，设置focus
	  inputRef.current.focus()
  }
  
  

  return (
    <div className="app">
      {/* 导航 Tab */}
      <div className="reply-navigation">
        <ul className="nav-bar">
          <li className="nav-title">
            <span className="nav-title-text">评论</span>
            {/* 评论数量 */}
            <span className="total-reply">{10}</span>
          </li>
          <li className="nav-sort">
            {/* 高亮类名： active */}
            {tabs.map(item => (
              <span
                key={item.type}
				onClick={() => handleTabChange(item.type)}
                className={classNames('nav-item', {'active':type === item.type})}>
                {item.text}
              </span>
            ))}
          </li>
        </ul>
      </div>

      <div className="reply-wrap">
        {/* 发表评论 */}
        <div className="box-normal">
          {/* 当前用户头像 */}
          <div className="reply-box-avatar">
            <div className="bili-avatar">
              <img className="bili-avatar-img" src="" alt="用户头像"/>
            </div>
          </div>
          <div className="reply-box-wrap">
            {/* 评论框 */}
            <textarea
              className="reply-box-textarea"
              placeholder="发一条友善的评论"
			  ref = {inputRef}
			  value={content}
			  onChange={(e)=>setContent(e.target.value)}
              // ref={inputRef}
            />
            {/* 发布按钮 */}
            <div className="reply-box-send">
              <div className="send-text" onClick={handlePublish}>发布</div>
            </div>
          </div>
        </div>
        {/* 评论列表 */}
        <div className="reply-list">
          {/* 评论项 */}
          {commentList.map(item => <Item key={item.rpid} item={item} onDel={handleDel}/>)}
        </div>
      </div>
    </div>
  )
}


export default App

