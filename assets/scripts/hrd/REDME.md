creator坐标系

1: 世界(屏幕)坐标系;
    坐标原点在左下角
2: 相对(节点)坐标系,两种相对节点原点的方式
    (1) 左下角为原点,
     this.node.convertToWorldSpace(cc.v2(0, 0));
     this.node.convertToNodeSpace(w_pos);
    (2) 锚点为原点(AR)
     this.node.convertToWorldSpaceAR(cc.v2(0, 0));
    this.node.convertToNodeSpaceAR(w_pos);
    两套API，带AR后缀和不带
3: 节点坐标和屏幕坐标的相互转换; 我们到底使用哪个？通常情况下带AR;
4: 获取在父亲节点坐标系下(AR为原点)的节点包围盒;
    this.node.getBoundingBox();
5: 获取在世界坐标系下的节点包围盒;
    this.node.getBoundingBoxToWorld();
6: 触摸事件对象世界坐标与节点坐标的转换;

 onLoad: function () {
 19         /*var w_pos = new cc.Vec2(100, 100);
 20         console.log(w_pos);
 21 
 22         w_pos = cc.v2(200, 200);
 23         console.log(w_pos);
 24 
 25         w_pos = cc.p(300, 300);
 26         console.log(w_pos);
 27 
 28         var src = cc.p(0, 0);
 29         var dst = cc.p(100, 100);
 30         var dir = cc.pSub(dst, src);
 31 
 32         var len = cc.pLength(dir);
 33         console.log(len);
 34 
 35         var s = new cc.Size(100, 100);
 36         console.log(s);
 37 
 38         s = cc.size(200, 200);
 39         console.log(s);
 40 
 41         var r = new cc.Rect(0, 0, 100,100);
 42         console.log(r);
 43 
 44         r = cc.rect(0, 0, 200, 200);
 45         console.log(r);
 46         var ret = r.contains(cc.p(300, 300));
 47         console.log(ret);
 48 
 49         var rhs = cc.rect(100, 100, 100, 100);
 50         ret = r.intersects(rhs);
 51         console.log(ret);*/
 52 
 53         // 节点坐标转到屏幕坐标 cc.p(0, 0)
 54         var w_pos = this.node.convertToWorldSpace(cc.p(0, 0)); // 左下角为原点的   cc.p(430, 270)
 55         console.log(w_pos);
 56         w_pos = this.node.convertToWorldSpaceAR(cc.p(0, 0)); // 锚点为原点 cc.p(480, 320)
 57         console.log(w_pos);
 58         // end 
 59 
 60         var w_pos = cc.p(480, 320);
 61 
 62         var node_pos = this.node.convertToNodeSpace(w_pos);
 63         console.log(node_pos); // cc.p(50, 50)
 64 
 65         node_pos = this.node.convertToNodeSpaceAR(w_pos);
 66         console.log(node_pos); // cc.p(0, 0)
 67     },
 68 
 69     start: function(){
 70         // 获取节点的包围盒, 相对于父亲节点坐标系下的包围盒
 71         var box = this.node.getBoundingBox();
 72         console.log(box);
 73 
 74         // 世界坐标系下的包围盒
 75         var w_box = this.node.getBoundingBoxToWorld();
 76         console.log(w_box);
 77 
 78         this.node.on(cc.Node.EventType.TOUCH_START, function(t) {
 79             var w_pos = t.getLocation();
 80             var pos = this.node.convertToNodeSpaceAR(w_pos);
 81             console.log(pos);
 82 
 83             pos = this.node.convertTouchToNodeSpaceAR(t);
 84             console.log("====", pos);
 85         }, this);
 86 
 87 
 88         // 我要把当前这个sub移动到世界坐标为 900, 600;
 89         // 
 90         // 把世界坐标转到相对于它的父亲节点的坐标
 91         var node_pos = this.node.parent.convertToNodeSpaceAR(cc.p(900, 600));
 92         this.node.setPosition(node_pos); // 相对于this.node.parent这个为参照物,AR为原点的坐标系
 93         // end 
 94         // 获取当前节点的世界坐标;
 95         this.node.convertToWorldSpaceAR(cc.p(0, 0));
 96     }
 97     // called every frame, uncomment this function to activate update callback
 98     // update: function (dt) {
 99 
100     // },
101 });