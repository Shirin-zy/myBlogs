CREATE TABLE `user` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `email` VARCHAR(128) NOT NULL COMMENT '用户邮箱（登录账号）',
  `password` VARCHAR(128) NOT NULL COMMENT '加密后的密码（推荐BCrypt加密）',
  `nickname` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '用户昵称',
  `avatar_url` VARCHAR(255) NOT NULL DEFAULT '' COMMENT '头像地址',
  `verify_code` VARCHAR(32) NOT NULL DEFAULT '' COMMENT '动态验证码',
  `verify_expire_time` DATETIME NULL DEFAULT NULL COMMENT '验证码过期时间',
  `ext_info` JSON NULL COMMENT '用户拓展信息(JSON格式)',
  `status` TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '账号状态：0禁用 1正常',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`) COMMENT '邮箱唯一索引，防止重复注册',
  KEY `idx_verify_expire` (`verify_expire_time`) COMMENT '验证码过期时间索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';