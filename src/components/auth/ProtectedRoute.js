import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/slices/auth/userSlice';
import usePermission from '../../hooks/usePermission';

/**
 * 权限保护的路由组件
 * @param {Object} props - 组件属性
 * @param {string|string[]} props.permissions - 访问该路由所需的权限
 * @param {boolean} props.requireAll - 是否需要满足所有指定的权限
 * @param {boolean} props.requireAuth - 是否只需要登录而不需要特定权限
 * @param {string} props.redirectTo - 无权限时重定向的路径
 * @param {React.Component} props.component - 要渲染的组件
 * @param {Object} props.rest - 其他Route组件接受的属性
 * @returns {React.ReactElement} Route组件
 */
const ProtectedRoute = ({
  permissions,
  requireAll = false,
  requireAuth = true,
  redirectTo = '/login',
  component: Component,
  ...rest
}) => {
  const currentUser = useSelector(selectCurrentUser);
  const { checkPermission, isAdmin } = usePermission();
  
  return (
    <Route
      {...rest}
      render={props => {
        // 检查是否已登录
        if (requireAuth && !currentUser) {
          return (
            <Redirect
              to={{
                pathname: redirectTo,
                state: { from: props.location }
              }}
            />
          );
        }

        // 如果只需要登录，或者是管理员，则允许访问
        if (!permissions || isAdmin()) {
          return <Component {...props} />;
        }

        // 检查是否有特定权限
        if (checkPermission(permissions, requireAll)) {
          return <Component {...props} />;
        }

        // 无权限时重定向
        return (
          <Redirect
            to={{
              pathname: '/unauthorized',
              state: { from: props.location, requiredPermissions: permissions }
            }}
          />
        );
      }}
    />
  );
};

export default ProtectedRoute; 