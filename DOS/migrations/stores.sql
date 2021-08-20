--
-- Name: alter_user(integer, character varying, character varying, integer, boolean, character varying, character varying, integer[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.alter_user(_user_id integer, _username character varying, _passwd character varying, _role_id integer, _disabled boolean, _first_name character varying, _last_name character varying, _authorities integer[]) RETURNS record
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    -- >> Description: Create/Edit user                                             >>
    -- >> Version:     nina_fresa                                                   >>
    -- >> Date:        04/ago/2021                                                  >>
    -- >> Developer:   Omar Montes                                                  >>
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    current_moment timestamp with time zone := now();
    last_id integer := 0;
	row_counter integer := 0;
	arr_len integer := 0;
	i integer := 0;

    -- dump of errors
    rmsg text := '';

BEGIN

    CASE
        WHEN _user_id = 0 THEN

            INSERT INTO users (
                username,
                passwd,
                role_id,
				disabled,
				first_name,
				last_name,
				last_touch_time,
                creation_time
            ) VALUES (
                _username,
                _passwd,
                _role_id,
				_disabled,
				_first_name,
				_last_name,
                current_moment,
                current_moment
            ) RETURNING id INTO last_id;

			arr_len := array_length(_authorities, 1);
			if arr_len is not NULL then

				for i in 1 .. arr_len loop
					insert into users_authorities values (last_id, _authorities[i]);
				end loop;

			end if;

        WHEN _user_id > 0 THEN

			if _passwd = '' then
				
				UPDATE users
				SET username = _username,
					role_id = _role_id,
					disabled = _disabled,
					first_name = _first_name,
					last_name = _last_name,
					last_touch_time = current_moment
				WHERE id = _user_id;
			
			else
				
				UPDATE users
				SET username = _username,
					passwd = _passwd,
					role_id = _role_id,
					disabled = _disabled,
					first_name = _first_name,
					last_name = _last_name,
					last_touch_time = current_moment
				WHERE id = _user_id;
			
			end if;
			
			GET DIAGNOSTICS row_counter = ROW_COUNT;
			if row_counter <> 1 then
				RAISE EXCEPTION 'user identifier % does not exist', _user_id;
			end if;

			delete from users_authorities where user_id = _user_id;

			arr_len := array_length(_authorities, 1);
			if arr_len is not NULL then

				for i in 1 .. arr_len loop
					insert into users_authorities values (_user_id, _authorities[i]);
				end loop;

			end if;

            -- Upon edition we return user id as last id
            last_id = _user_id;

        ELSE
            RAISE EXCEPTION 'negative user identifier % is unsupported', _user_id;

    END CASE;

    return ( last_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;


ALTER FUNCTION public.alter_user(_user_id integer, _username character varying, _passwd character varying, _role_id integer, _disabled boolean, _first_name character varying, _last_name character varying, _authorities integer[]) OWNER TO postgres;








CREATE FUNCTION public.alter_patios(
    _user_id integer,
    _username character varying,
    _passwd character varying,
    _role_id integer,
    _disabled boolean,
    _first_name character varying,
    _last_name character varying,
    _authorities integer[],
    _title character varying,
    
    _code_carriers character varying,
    _title_carriers character varying,
    _disabled_carriers boolean,
    _last_touch_time_carriers timestamp,
    _creationTime_carriers timestamp,
    _blocked_carriers boolean,
    
    _id_patios INT,
    _code_patios character varying,
    _title_patios character varying,
    _last_touch_time_patios timestamp,
    _creation_time_patios timestamp,
    _blocked_patios boolean,
    
    _id_roles INT,
    _title_roles character varying,
    
    _idu_users INT,
    _username_users character varying,
    _passwd_users character varying,
    _disabled_users boolean,
    _first_name_users character varying,
    _last_name_users character varying,
    _last_touch_time_users timestamp,
    _creation_time_users timestamp,
    _blocked_users boolean,
    
--    _user_id_users_authorities ,
--    _authority_idusers_authorities,
    
    _id_apps INT,
    _title_apps character varying,
    _code_apps character varying
) RETURNS record
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    -- >> Description: Create/Edit user                                             >>
    -- >> Version:     Ver 1 patios                                                 >>
    -- >> Date:        19/ago/2021                                                  >>
    -- >> Developer:   Alvaro Gamez Chavez                                          >>
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    current_moment timestamp with time zone := now();
    last_id integer := 0;
	row_counter integer := 0;
	arr_len integer := 0;
	i integer := 0;

    -- dump of errors
    rmsg text := '';

BEGIN

    CASE
        WHEN _user_id = 0 THEN

            INSERT INTO users (
                username,
                passwd,
                role_id,
				disabled,
				first_name,
				last_name,
				last_touch_time,
                creation_time
                --bloocked
            ) VALUES (
                _username,
                _passwd,
                _role_id,
				_disabled,
				_first_name,
				_last_name,
                current_moment,
                current_moment
            ) RETURNING id INTO last_id;

			arr_len := array_length(_authorities, 1);
			if arr_len is not NULL then

				for i in 1 .. arr_len loop
					insert into users_authorities values (last_id, _authorities[i]);
				end loop;

			end if;
			
			INSERT INTO apps(
                title
			) VALUES(
                _title_apps
			);
			
			INSERT INTO authorities(
                app_id,
                code,
                title
			)VALUES(
                _app_id_apps,
                _code_apps,
                _title_apps
			);
			
			INSERT INTO carries(
                code, 
                title,
                disabled,
                last_touch_time,
                creation_time
                --blocked
			)VALUES(
                _code_carriers,
                _title_carriers,
                _disabled_carriers,
                _last_touch_time_carriers,
                _creationTime_carriers
			);
			
			INSERT INTO patios(
                code,
                title,
                last_touch_time,
                creation_time
                --blocked
			)VALUES(
                _code_patios,
                _title_patios,
                current_moment,
                current_moment
			);
			
			INSERT INTO roles(
                title
			)VALUES(
                _title_roles
			);
			

        WHEN _user_id > 0 THEN

			if _passwd = '' then
				
				UPDATE users
				SET username = _username,
					role_id = _role_id,
					disabled = _disabled,
					first_name = _first_name,
					last_name = _last_name,
					last_touch_time = current_moment
				WHERE id = _user_id;
			
			else
				
				UPDATE users
				SET username = _username,
					passwd = _passwd,
					role_id = _role_id,
					disabled = _disabled,
					first_name = _first_name,
					last_name = _last_name,
					last_touch_time = current_moment
				WHERE id = _user_id;
			
			end if;
			
			GET DIAGNOSTICS row_counter = ROW_COUNT;
			if row_counter <> 1 then
				RAISE EXCEPTION 'user identifier % does not exist', _user_id;
			end if;

			delete from users_authorities where user_id = _user_id;

			arr_len := array_length(_authorities, 1);
			if arr_len is not NULL then

				for i in 1 .. arr_len loop
					insert into users_authorities values (_user_id, _authorities[i]);
				end loop;

			end if;

            -- Upon edition we return user id as last id
            last_id = _user_id;

        ELSE
            RAISE EXCEPTION 'negative user identifier % is unsupported', _user_id;

    END CASE;

    return ( last_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;
