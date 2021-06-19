import { Button, PageHeader, Space, Table, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { API_GetAllProductDetail } from '../../../Product/apis/product.api'
import { IProductDetail } from '../../../Product/shared/interfaces/product.interfaces'
import { MainContainer } from './productManufactExport.styles'
import { DeleteOutlined , ExportOutlined} from'@ant-design/icons';
const {Column} = Table

export default function ProductManufactExport() {
    const [prodDetails,setProdDetails] = useState<null | Array<IProductDetail>>(null)
    
    async function getAllProductDetailData(){
      const mapped_response = await API_GetAllProductDetail({with_product:true})
      if(mapped_response.success){
        console.log(mapped_response)
        setProdDetails(mapped_response.data)
      }else{
        // failed to get the prodmanu datas
      }
    }
    useEffect(() => {
        getAllProductDetailData()
    },[])

    return (
        <MainContainer>
            <div style={{ marginLeft: -20,marginBottom:25 }} className="site-page-header-ghost-wrapper">
                    <PageHeader
                    ghost={false}
                    title="การจัดจำหน่าย"
                    subTitle="ส่งสินค้าออกจำหน่าย"
                    >
                    </PageHeader>
            </div>
            <Table dataSource={prodDetails || []} bordered loading={prodDetails===null} size="middle" pagination={{ pageSize:8 }} rowKey="id" >
                <Column width="8%" align="center" title="รหัสสินค้า [SKU]" dataIndex="product_code" key="product_code"/>
                <Column width="8%" align="center" title="ชื่อสินค้า" dataIndex="product_name" key="product_name"/>
                <Column width="10%" align="center" title="สินค้าทั้งหมด" render={(text,record:IProductDetail) => {
                    // We will filtered the on in queue out [but for now i think this is enough]
                    // return <span>{record.product_entity?.filter(data => data.quality_passed && !data.is_in_queue).length} ชื้น</span>
                    return <span>{record.product_entity?.length} ชื้น</span>
                }}/>
                <Column width="10%" align="center" title="จำนวนที่พร้อมส่งออก" render={(text,record:IProductDetail) => {
                    // We will filtered the on in queue out [but for now i think this is enough]
                    // return <span>{record.product_entity?.filter(data => data.quality_passed && !data.is_in_queue).length} ชื้น</span>
                    return <span>{record.product_entity?.filter(data => data.quality_passed).length} ชื้น</span>
                }}/>
                 <Column width="5%" align="center" title="การจัดการ" render={(text,record:IProductDetail) => {
                    return  <Space>
                        <Tooltip placement="bottom" title="ส่งสินค้าออกจำหน่าย">
                            <Button type="primary" ghost shape="circle" icon={<ExportOutlined />} size="middle" />
                        </Tooltip>
                        {/* <Tooltip placement="bottom" title="ลบพนักงานออกจากระบบ">
                            <Button ghost danger shape="circle" icon={<DeleteOutlined />} size="middle" />
                        </Tooltip> */}
                        </Space>
            }   }/>
            </Table>
        </MainContainer>
    )
}
