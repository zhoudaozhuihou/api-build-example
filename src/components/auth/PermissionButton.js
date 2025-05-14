import React from 'react';
import { Button, Tooltip } from '@material-ui/core';
import usePermission from '../../hooks/usePermission';

/**
 * 权限控制的按钮组件
 * @param {Object} props - 组件属性
 * @param {string|string[]} props.permissions - 使用按钮所需的权限
 * @param {boolean} props.requireAll - 是否需要满足所有指定的权限
 * @param {boolean} props.hideOnNoPermission - 无权限时是否隐藏按钮，否则显示禁用状态
 * @param {string} props.noPermissionText - 无权限时的提示文本
 * @param {React.ReactNode} props.children - 按钮内容
 * @param {Object} props.rest - 其他Button组件接受的属性
 * @returns {React.ReactElement|null} 按钮组件或null
 */
const PermissionButton = ({
  permissions,
  requireAll = false,
  hideOnNoPermission = false,
  noPermissionText = '您没有权限执行此操作',
  children,
  ...rest
}) => {
  const { checkPermission, isAdmin } = usePermission();
  
  // 检查是否有权限
  const hasRequiredPermission = checkPermission(permissions, requireAll) || isAdmin();
  
  // 如果无权限且需要隐藏，则返回null
  if (!hasRequiredPermission && hideOnNoPermission) {
    return null;
  }
  
  // 如果无权限但不隐藏，则显示禁用的按钮
  if (!hasRequiredPermission) {
    return (
      <Tooltip title={noPermissionText}>
        <span>
          <Button
            {...rest}
            disabled
          >
            {children}
          </Button>
        </span>
      </Tooltip>
    );
  }
  
  // 有权限时显示正常按钮
  return (
    <Button
      {...rest}
    >
      {children}
    </Button>
  );
};

export default PermissionButton; 