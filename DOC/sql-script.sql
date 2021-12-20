SELECT tblbusiness.*,
tblbuscat.catId,tbllocation.locname, tblcategory.catname  FROM tblbusiness INNER JOIN tblbuscat ON tblbusiness.syskey=tblbuscat.busCatid left join tbllocation on 
tblbusiness.locid= tbllocation.syskey left join tblcategory on tblbuscat.catid= tblcategory.syskey GROUP BY tblbusiness.syskey ORDER BY tblbusiness.adsStatus DESC ,tblbusiness.name ASC 

-------------------------------------------------
