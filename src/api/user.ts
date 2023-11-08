/**
 * Copyright (c) 2013-Now http://jeesite.com All rights reserved.
 * No deletion without permission, or be held responsible to law.
 * @author IcingPig
 */
import { defHttp } from "../utils/axios";

//登录
export const login = (params: any) =>
    defHttp.post({ url: '/login', params });

