左侧增加tabs条

使用方法引入组件


//这个onchange是点击事件会有点击的key传过来
leftbarchange = (num) => {
    console.log(num)
}

<LeftBar onChange={this.leftbarchange} title="XXX" topContant="" bottomContant="">
    <TabPane tab="电审信息" key="1">
        页面1
    </TabPane>
    <TabPane tab="电审记录" key="2">
        页面1
    </TabPane>
    <TabPane tab="贷款订单" key="3">
        页面1
    </TabPane>
</LeftBar>