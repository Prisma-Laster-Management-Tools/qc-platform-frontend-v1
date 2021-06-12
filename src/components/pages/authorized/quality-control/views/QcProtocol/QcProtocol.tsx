import React, { useEffect, useState } from 'react'
import { MainContainer } from './qcProtocol.styles'
import { PageHeader, Button, Descriptions,Tag, Table, Space, Tooltip } from 'antd';
import Moment from 'react-moment';
import { API_GetAllProduct, API_GetAllProductDetail } from '../../../Product/apis/product.api';
import { IProductDetail, IProductList } from '../../../Product/shared/interfaces/product.interfaces';
import { EditTwoTone,FormOutlined } from '@ant-design/icons';
import ProtocolCreationModal from './sub-component/ProtocolCreationModal/ProtocolCreationModal';
const {Column} = Table
const QcProtocol = () => {
    const [prodDetails,setProdDetails] = useState<Array<IProductDetail> | null>(null)

    //
    // ─── FOR CHILD MODAL ────────────────────────────────────────────────────────────
    //
    const [focusProductCode,setFocusProductCode] = useState<string|null>(null)
    // ────────────────────────────────────────────────────────────────────────────────


    async function fetchAllProductDetail(){
      const mapped_response = await API_GetAllProductDetail({with_protocol:true})
      if(mapped_response.success){
        setProdDetails(mapped_response.data)
        console.log(mapped_response)
      }else{
        // failed to fetch the data
      }
    }

    //
    // ─── CB ──────────────────────────────────────────────────────────
    //
    async function onProtocolHasAnyOperation(){
      fetchAllProductDetail() // refetching again
    }
    // ─────────────────────────────────────────────────────────────────

  
    useEffect(() => {
      fetchAllProductDetail()
    },[])

    //
    // ─── VIS HELPER ─────────────────────────────────────────────────────────────────
    //
    function generateProtolcolTag(total_protocl:number){
        if(!total_protocl)return  <>
                             <Tag>ยังไม่มีข้อกำหนด</Tag>
                                    </>
        return  <>
                <Tag color="geekblue">{total_protocl} ข้อกำหนด</Tag>
            </>
    }
    function generateOperationButton(have_protocol:boolean,record: IProductDetail){
        if(have_protocol){
            return             <Tooltip placement="bottom" title="แก้ไขข้อกำหนด">
            <Button onClick={() => setFocusProductCode(record.product_code)} ghost type="primary" shape="circle" icon={<EditTwoTone />} size="middle" />
        </Tooltip>
        }else{
            return <Tooltip placement="bottom" title="สร้างข้อกำหนด">
            <Button onClick={() => setFocusProductCode(record.product_code)} style={{ borderColor:'firebrick' }} ghost type="primary" shape="circle" icon={<FormOutlined style={{color:'firebrick'}}/>} size="middle" />
        </Tooltip>
        }
    }
    // ────────────────────────────────────────────────────────────────────────────────

  return (
    <MainContainer>
    <ProtocolCreationModal on_crud={onProtocolHasAnyOperation} back={() => setFocusProductCode(null)} visible={!!focusProductCode} product_code={focusProductCode}/>
      <div className="site-page-header-ghost-wrapper">
            <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title="ข้อกำหนดมาตรฐานของสินค้า"
            >
            </PageHeader>
        </div>
        <Table onRow={(r) => ({onClick: () => console.log("lol")})} dataSource={prodDetails || []} rowKey="id" size="middle" pagination={{ pageSize:8 }} bordered loading={prodDetails===null}>
          <Column title="รหัสสินค้า (SKU)" dataIndex="product_code" key="product_code" />
          <Column title="ชื่อสินค้า" dataIndex="product_name" key="product_name" />
          <Column align="center" width="10%" title="ข้อกำหนด" render={(text,record: IProductDetail) => {
            return generateProtolcolTag(record.protocol!.length)
          }}/>
            <Column align="center" width="10%" title="การจัดการ" render={(text,record: IProductDetail) => {
            return <Space>
                {generateOperationButton(!!record.protocol!.length,record)}
            {/* <Tooltip placement="bottom" title="นำสินค้าออกจากคิว">
                <Button ghost danger shape="circle" icon={<ExportOutlined />} size="middle" />
            </Tooltip> */}
    </Space>
          }}/>
        </Table>
    </MainContainer>
  )
}

export default QcProtocol